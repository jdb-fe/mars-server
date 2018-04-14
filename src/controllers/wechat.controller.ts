import { Controller, All, Res, Req } from '@nestjs/common';
import { Validator } from 'class-validator';

const validator = new Validator();

@Controller('wechat')
export class WechatController {
    @All()
    root(@Res() res, @Req() req) {
        const { weixin } = req;
        let msg = '哈哈哈';
        if (weixin.MsgType === 'text') {
            let input = (weixin.Content || '').trim();
            if (validator.isURL(input)) {
                msg = '你推荐了一个链接啊';
            }
        }
        res.reply(msg);
    }
}
