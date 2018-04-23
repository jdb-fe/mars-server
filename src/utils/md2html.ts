import * as showdown from 'showdown';
import './showdown-plugins/showdown-footnote';
import './showdown-plugins/showdown-prettify-for-wechat';
import './showdown-plugins/showdown-task-list';

const converter = new showdown.Converter({
    extensions: ['prettify', 'tasklist', 'footnote'],
    tables: true,
    simpleLineBreaks: true,
    strikethrough: true,
});

export function md2html(markdown: string): string {
    return converter.makeHtml(markdown);
}
