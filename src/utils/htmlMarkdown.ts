import * as turndown from 'turndown';
import * as turndownPluginGfm from 'turndown-plugin-gfm';
import * as MarkdownIt from 'markdown-it';
import * as hljs from 'highlight.js';
import * as cheerio from 'cheerio';


const turndownService = new turndown({
    codeBlockStyle: 'fenced'
});
turndownService.remove('noscript');
/**
 * http://blog.aepkill.com/2016/10/07/zone.js/
 */
const highlightRegExp = /highlight|hljs/
turndownService.addRule('highlightedCodes', {
    filter: node => {
        const classes = node.className.split(' ');
        return node.firstChild && (classes.includes('highlight') || classes.includes('hljs'));
    },
    replacement: (content, node, options) => {
        const firstChild = node.firstChild;
        const classes = node.className.split(' ');
        let language = '';
        let index = classes.indexOf('highlight');
        let el = firstChild;
        if (index !== -1) {
            classes.splice(index, 1);
            language = classes[0];
        } else {
            if (node.tagName.toLowerCase() === 'code') {
                language = node.className && node.className.split(' ')[1];
                el = node;
            } else {
                language = firstChild.className && firstChild.className.split('-')[1];
            }
        }
        language = language || '';
        const $ = cheerio.load(el.innerHTML, {
            decodeEntities: false
        });
        let codes = '';
        let tmp = [];
        $('pre').last().find('.line').each(function () {
            tmp.push($(this).text());
        });
        if (tmp.length) {
            codes = tmp.join('\n');
        } else {
            codes = $('code').text() || firstChild.textContent;
        }
        return `\n\n${options.fence}${language}\n${codes}\n${options.fence}\n\n`;
    }
});
turndownService.use(turndownPluginGfm.gfm);

export function toMarkdown(html: string): string {
    return turndownService.turndown(html);
}



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
    html: true,
    breaks: true,
    linkify: true,
    typographer: true,
    highlight: function(str, lang) {
        let res = Renderer.utils.escapeHtml(str);
        if (lang && hljs.getLanguage(lang)) {
            try {
                let code = hljs.highlight(lang, str, true).value;
                let $ = cheerio.load(code, {
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
                res = $.html();
            } catch (__) {}
        }
        return `<pre class="hljs" style="${hljsClasss['.hljs']}"><code>${res}</code></pre>`;
    }
});

export function toHtml(markdown: string): string {
    return Renderer.render(markdown);
}
