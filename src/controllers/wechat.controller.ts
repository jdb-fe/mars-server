import { Controller, All, Res, Req } from '@nestjs/common';

import { validator } from '../utils/utils';
import { ParserService } from '../services/parser.service';
import { RuleService } from '../services/rule.service';
import { PostService } from '../services/post.service';

@Controller('wechat')
export class WechatController {
    busy = false
    constructor(
        private readonly parserService: ParserService,
        private readonly ruleService: RuleService,
        private readonly postService: PostService,
    ) {}
    @All()
    async root(@Res() res, @Req() req) {
        const { weixin } = req;
        let msg:string|[any] = '直接发送文章链接即可推荐文章给我哦~~~';
        if (weixin.MsgType === 'text') {
            let input = (weixin.Content || '').trim();
            if (validator.isURL(input) ) {
                // 是否已经推荐了
                let output:any = await this.postService.findByUrl(input);
                if (!output && !this.busy) {
                    this.busy = true;
                    // 是否有规则
                    let parseRule = await this.ruleService.findByUrl(input);
                    try {
                        if (parseRule) {
                            output = await this.parserService.url(input, parseRule);
                        } else {
                            output = await this.parserService.mercury(input);
                        }
                    } catch (error) {
                        console.log(error);
                        output = await this.parserService.data(input);
                    }
                    this.busy = false;
                    output.url = input;
                    await this.postService.insert(output);
                }
                if (!this.busy) {
                    msg = [{
                        title: output.title,
                        description: output.description,
                        picurl: output.thumb,
                        url: output.url
                    }];
                }
            }
        }
        res.reply(msg);
    }
}
