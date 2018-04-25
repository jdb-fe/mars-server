import { Component } from '@nestjs/common';

import * as fs from 'fs';
import * as path from 'path';
import * as puppeteer from 'puppeteer';
import { Browser, Page, EvaluateFn } from 'puppeteer';
import * as striptags from 'striptags';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { resolve as URLResolve, URLSearchParams } from 'url';

import { IRule } from './rule.service';
import { IPost } from './post.service';
import { ConfigService } from './config.service';

@Component()
export class ParserService {
    constructor(private readonly configService: ConfigService) {
    }
    private injectjs = path.join(__dirname, '..', 'utils', 'jquery-3.3.1.min.js');
    private browser: Browser
    private async puppeteer(url: string, inject: EvaluateFn): Promise<IPost> {
        if (!this.browser) {
            this.browser = await puppeteer.launch({args: ['--no-sandbox']});
        }
        const page = await this.browser.newPage();
        console.log(`start open url: ${url}`);
        await page.goto(url, {
            timeout: 0
        });
        console.log(`url opened: ${url}`);
        // await page.waitFor(5000);
        await page.evaluate(fs.readFileSync(this.injectjs, 'utf8'));
        await page.evaluate(() => {
            let $ = (<any>window).jQuery;
            /**
             * @desc 修复图片链接
             */
            $('img').each(function () {
                let $this = $(this);
                let src = this.src;
                if ($this.data('src')) {
                    src = $this.data('src');
                } else if ($this.data('actualsrc')) {
                    src = $this.data('actualsrc');
                }
                $this.attr('src', src);
            });
            ['href', 'src'].forEach(attr => {
                $(`[${attr}]`).each(function() {
                    $(this).attr(attr, this[attr]);
                });
            });
            (<any>window).__findImage = function() {
                return $('img')
                    .filter(function() {
                        return $(this).width() >= 50 && $(this).height() >= 50;
                    })
                    .eq(0)
                    .attr('src');
            };
        });

        const ret = await page.evaluate(inject);
        console.log(`url parsed: ${url}`);
        await this.browser.close();
        this.browser = null;
        return ret;
    }
    /**
     * 解析url
     * @param url string
     */
    async url(url: string, rule: IRule): Promise<IPost> {
        let inject = `{title: ${rule.title}, html: ${rule.html}`;
        if (rule.description) {
            inject += `, description: ${rule.description}`;
        }
        if (rule.thumb) {
            inject += `, thumb: ${rule.thumb} || __findImage()`;
        }
        inject += '}';

        let ret = await this.puppeteer(url, `(${inject})`);

        if (ret.title) {
            ret.title = ret.title.trim();
        }
        if (ret.html) {
            ret.html = ret.html.trim();
        }
        if (!ret.description) {
            ret.description = striptags(ret.html)
                .replace(/\s/g, '')
                .substr(0, 250);
        }
        return ret;
    }
    async data(url: string): Promise<IPost> {
        const $ = await this.htmlParse(url);

        let result: IPost = {
            title: $('title').text().trim(),
            thumb: $('img[src]').eq(0).attr('src'),
            description: $('[name=description]').attr('content').trim(),
            html: $('body').html()
        };

        return result;
    }
    async mercury(url: string): Promise<IPost> {
        const conf = await this.configService.get();
        console.log('mercury parse');
        const mercury = await axios
            .get('https://mercury.postlight.com/parser', {
                params: {
                    url: url
                },
                headers: {
                    'x-api-key': conf.mercury,
                },
            })
            .then(res => res.data);
        return {
            title: mercury.title,
            html: mercury.content,
            thumb: mercury.lead_image_url,
            description: mercury.excerpt,
        };
    }
    private async htmlParse(url: string): Promise<CheerioStatic> {
        const response = await axios.get(url);
        const contentType = response.headers['content-type'];
        if (contentType.indexOf('text/html') > -1) {
            let $ = cheerio.load(response.data, {
                decodeEntities: false
            });

            // 修复链接地址
            ['href', 'src', 'data-src'].forEach((attr) => {
                $(`[${attr}]`).each(function () {
                    let $this = $(this);
                    let val = $this.attr(attr);
                    if (val) {
                        $this.attr(attr.replace('data-', ''), URLResolve(url, val));
                        if ($this.get(0).tagName === 'iframe') {
                            let urlParams = new URLSearchParams(val);
                            let width = urlParams.get('width') || '100%';
                            let height = urlParams.get('height') || 'auto';
                            $this.attr('style', 'dispaly:block;max-width:100%;');
                            $this.attr('width', width);
                            $this.attr('height', height);
                        }
                    }
                });
            });

            return $;
        }
        throw 'response not html';
    }
    /**
     * 通过 cheerio 解析html抓取内容
     * @param url 文章链接
     * @param rule 文章解析规则
     */
    async html(url: string, rule: IRule): Promise<IPost> {
        const $ = await this.htmlParse(url);

        let result:any = {};

        ['title', 'description', 'html', 'thumb'].forEach((key) => {
            if (!result[key] && rule[key]) {
                try {
                    result[key] = eval(rule[key]);
                } catch (error) {}
            }
        });

        if (!result.title) {
            result.title = $('title').text();
        }

        if (!result.description) {
            if (result.html) {
                result.description = striptags(result.html).replace(/\s/g, '').substr(0, 250);
            } else if ($('meta[name="description"]').length) {
                result.description = $('meta[name="description"]').attr('content');
            }
        }
        if (!result.thumb) {
            result.thumb = $('img[src]').eq(0).attr('src');
        }

        if (!result.html) {
            result.html = $('body').html();
        }

        // trim
        for (let k in result) {
            if (result[k] && typeof result[k] === 'string') {
                result[k] = result[k].trim();
            }
        }

        return result;
    }
}
