import { Module, NestModule, MiddlewaresConsumer } from '@nestjs/common';

import { WechatController } from '../controllers/wechat.controller';

import { WechatMiddleware } from '../middlewares/wechat.middleware';

@Module({
    controllers: [WechatController],
})
export class WechatModule implements NestModule {
    configure(consumer: MiddlewaresConsumer): void {
        consumer.apply(WechatMiddleware)
            .with({
                token: 'wechat',
                appid: 'wxcb816a269be9eebe',
                encodingAESKey: 'jvpVKAptdSpjLxoY5mXXhdDdt3SHsO4gYSmCt6iFlwb'
            })
            .forRoutes(WechatController);
    }
}
