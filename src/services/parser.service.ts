import { Component } from '@nestjs/common';

import * as fs from 'fs';
import * as path from 'path';
import * as puppeteer from 'puppeteer';
import { Browser, Page, EvaluateFn } from 'puppeteer';
import * as striptags from 'striptags';
import axios from 'axios';

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
    data(url: string): Promise<IPost> {
        return this.puppeteer(url, () => {
            let $ = (<any>window).jQuery;
            return {
                title: $('title').text().trim(),
                thumb: (<any>window).__findImage(),
                description: $('[name=description]').attr('content').trim(),
                html: $('body').html()
            }
        });
    }
    async mercury(url: string): Promise<IPost> {
        const conf = await this.configService.get();
        const mercury = await axios
            .get(`https://mercury.postlight.com/parser?url=${url}`, {
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
}
