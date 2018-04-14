import { Middleware, NestMiddleware, ExpressMiddleware } from '@nestjs/common';

import * as wechat from 'wechat';

export interface WechatConfig {
    token: string;
    appid?: string;
    encodingAESKey?: string;
    checkSignature?: boolean;
}

@Middleware()
export class WechatMiddleware implements NestMiddleware {
    resolve(config: string | WechatConfig): ExpressMiddleware {
        return new wechat(config).middlewarify();
    }
}