import * as turndown from 'turndown';
import * as turndownPluginGfm from 'turndown-plugin-gfm';

const turndownService = new turndown();
turndownService.use(turndownPluginGfm.gfm);

/**
 * html转markdown
 * @param html
 */
export function html2md(html: string): string {
    return turndownService.turndown(html);
}

import { Validator } from 'class-validator';
export const validator: Validator = new Validator();

/**
 * 将import对象转成数组
 * @param importObject
 */
export function importToArray<Key extends string, PropType>(importObject: Record<Key, PropType>,): PropType[] {
    const keys = Object.getOwnPropertyNames(importObject);
    return keys.filter(key => key.indexOf('__') !== 0).map(key => importObject[key]);
}
