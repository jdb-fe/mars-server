import { Injectable, HttpService } from '@nestjs/common';

import * as striptags from 'striptags';
import * as cheerio from 'cheerio';
import { resolve as URLResolve, URLSearchParams } from 'url';

import { IRule } from './rule.service';
import { IPost } from './post.service';
import { ConfigService } from './config.service';

@Injectable()
export class ParserService {
    constructor(
        private readonly configService: ConfigService,
        private readonly httpService: HttpService
    ) {
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
        const response = await this.httpService.get('https://mercury.postlight.com/parser', {
            params: {
                url: url
            },
            headers: {
                'x-api-key': conf.mercury,
            }
        }).toPromise();
        const mercury = response.data;
        return {
            title: mercury.title,
            html: mercury.content,
            thumb: mercury.lead_image_url || undefined,
            description: mercury.excerpt,
        };
    }
    private async htmlParse(url: string): Promise<CheerioStatic> {
        const response = await this.httpService.get(url).toPromise();
        const contentType = response.headers['content-type'];
        if (contentType.indexOf('text/html') > -1) {
            let $ = cheerio.load(response.data);

            // fix https://github.com/cheeriojs/cheerio/issues/866
            const $html = $.prototype.html;
            $.prototype.html = function () {
                let result = $html.apply(this, arguments);
                if (typeof result === 'string') {
                    result = result.replace(/&#x([0-9a-f]{1,6});/ig, (entity, code) => {
                        code = parseInt(code, 16);
                        if (code < 0x80) {
                            return entity;
                        }
                        return String.fromCodePoint(code);
                    });
                }
                return result;
            };

            // 修复链接地址
            ['href', 'src', 'data-src', 'data-original'].forEach((attr) => {
                $(`[${attr}]`).each(function () {
                    let $this = $(this);
                    let val = $this.attr(attr);
                    if (val) {
                        $this.attr(attr === 'href' ? 'href' : 'src', URLResolve(url, val));
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

        if (!result.html) {
            result.html = $('body').html();
        }

        if (!result.thumb) {
            let $$ = cheerio.load(result.html, {
                decodeEntities: false
            });
            result.thumb = $$('img[src]').eq(0).attr('src');
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
