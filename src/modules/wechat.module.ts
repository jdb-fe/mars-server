import { Module, NestModule, MiddlewaresConsumer } from '@nestjs/common';

import { CommonModule } from './common.module';
import { WechatController } from '../controllers/wechat.controller';
import { WechatMiddleware } from '../middlewares/wechat.middleware';

import { ParserService } from '../services/parser.service';

@Module({
    imports: [CommonModule],
    controllers: [WechatController],
    components: [ParserService],
    exports: [ParserService]
})
export class WechatModule implements NestModule {
    configure(consumer: MiddlewaresConsumer): void {
        consumer.apply(WechatMiddleware)
            .with({
                token: 'wechat',
                appid: 'wx950185c910864189',
                encodingAESKey: 'jvpVKAptdSpjLxoY5mXXhdDdt3SHsO4gYSmCt6iFlwb'
            })
            .forRoutes(WechatController);
    }
}
