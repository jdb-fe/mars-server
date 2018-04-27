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
export function importToArray<Key extends string, PropType>(importObject: Record<Key, PropType>, ): PropType[] {
    const keys = Object.getOwnPropertyNames(importObject);
    return keys.filter(key => key.indexOf('__') !== 0).map(key => importObject[key]);
}

import * as nodemailer from 'nodemailer';
interface IConfig {
    mail: {
        user: string;
        pass: string;
        host: string;
    }
    subscriber: string[]
};
export function sendMail(conf: IConfig, html: string, subject = 'Mars Daily', attachments = []) {
    return new Promise((resolve, reject) => {
        let transporter = nodemailer.createTransport({
            host: conf.mail.host,
            secureConnection: true, // use SSL
            port: 465,
            secure: true, // secure:true for port 465, secure:false for port 587
            auth: {
                user: conf.mail.user,
                pass: conf.mail.pass
            }
        });
        transporter.sendMail({
            from: `"Mars" <${conf.mail.user}>`,
            to: conf.subscriber.join(','),
            subject: subject,
            html: html,
            attachments: attachments
        }, (error, info) => {
            error ? reject(error) : resolve(info);
        });
    });
}
