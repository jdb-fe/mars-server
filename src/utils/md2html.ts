import * as MarkdownIt from 'markdown-it';
import * as hljs from 'highlight.js';
import * as cheerio from 'cheerio';

const hljsClasss = {
    '.hljs': 'display: block;overflow-x: auto;padding: 0.5em;background: #23241f;color: #f8f8f2;',
    '.hljs-tag': 'color: #f8f8f2;',
    '.hljs-subst': 'color: #f8f8f2;',
    '.hljs-strong': 'color: #a8a8a2; font-weight: bold;',
    '.hljs-emphasis': 'color: #a8a8a2;font-style: italic;',
    '.hljs-bullet': 'color: #ae81ff;',
    '.hljs-quote': 'color: #ae81ff;',
    '.hljs-number': 'color: #ae81ff;',
    '.hljs-regexp': 'color: #ae81ff;',
    '.hljs-literal': 'color: #ae81ff;',
    '.hljs-link': 'color: #ae81ff;',
    '.hljs-code':'color: #a6e22e;',
    '.hljs-title': 'color: #a6e22e;',
    '.hljs-section': 'color: #a6e22e;',
    '.hljs-selector-class': 'color: #a6e22e;',
    '.hljs-keyword': 'color: #f92672;',
    '.hljs-selector-tag': 'color: #f92672;',
    '.hljs-name': 'color: #f92672;',
    '.hljs-attr': 'color: #f92672;',
    '.hljs-symbol': 'color: #66d9ef;',
    '.hljs-attribute': 'color: #66d9ef;',
    '.hljs-params': 'color: #f8f8f2;',
    '.hljs-string': 'color: #e6db74;',
    '.hljs-type': 'color: #e6db74;',
    '.hljs-built_in': 'color: #e6db74;',
    '.hljs-builtin-name': 'color: #e6db74;',
    '.hljs-selector-id': 'color: #e6db74;',
    '.hljs-selector-attr': 'color: #e6db74;',
    '.hljs-selector-pseudo': 'color: #e6db74;',
    '.hljs-addition': 'color: #e6db74;',
    '.hljs-variable': 'color: #e6db74;',
    '.hljs-template-variable': 'color: #e6db74;',
    '.hljs-comment':'color: #75715e;',
    '.hljs-deletion':'color: #75715e;',
    '.hljs-meta': 'color: #75715e;',
    '.hljs-class .hljs-title': 'color: #f8f8f2;',
};

const Renderer = new MarkdownIt({
    breaks: true,
    linkify: true,
    typographer: true,
    highlight: function(str, lang) {
        let res = Renderer.utils.escapeHtml(str);
        if (lang && hljs.getLanguage(lang)) {
            try {
                res = hljs.highlight(lang, str, true).value;
            } catch (__) {}
        }
        const $ = cheerio.load(`<pre class="hljs"><code>${res}</code></pre>`, {
            decodeEntities: false
        });
        for (let className in hljsClasss) {
            $(`${className}`).each(function () {
                let $this = $(this);
                let style = $this.attr('style') || '';
                style += hljsClasss[className];
                $this.attr('style', style);
            });
        }
        return $.html();
    }
});

export function md2html(markdown: string): string {
    return Renderer.render(markdown);
}
