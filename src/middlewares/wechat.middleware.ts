import { Injectable, NestMiddleware, MiddlewareFunction } from '@nestjs/common';

import * as wechat from 'wechat';

export interface WechatConfig {
    token: string;
    appid?: string;
    encodingAESKey?: string;
    checkSignature?: boolean;
}

@Injectable()
export class WechatMiddleware implements NestMiddleware {
    resolve(config: string | WechatConfig): MiddlewareFunction {
        return new wechat(config).middlewarify();
    }
}
