import { Controller, All, Res, Req } from '@nestjs/common';

import { validator } from '../utils/utils';
import { ParserService } from '../services/parser.service';
import { RuleService } from '../services/rule.service';
import { PostService } from '../services/post.service';
import { ConfigService } from '../services/config.service';
import { WechatService } from '../services/wechat.service';
import { ScheduleService } from '../services/schedule.service';

import * as WechatMp from 'wechat-mp-hack';

@Controller('wechat')
export class WechatController {
    constructor(
        private readonly parserService: ParserService,
        private readonly ruleService: RuleService,
        private readonly postService: PostService,
        private readonly configService: ConfigService,
        private readonly wechatService: WechatService,
        private readonly scheduleService: ScheduleService,
    ) {}
    @All()
    async root(@Res() res, @Req() req) {
        const { weixin } = req;
        let msg:string|[any] = '直接发送文章链接即可推荐文章给我哦~~~';
        if (weixin.MsgType === 'text') {
            let input = (weixin.Content || '').trim();
            if (validator.isURL(input) ) {
                msg = await this.recommendPost(input, weixin.FromUserName);
            } else if (weixin.FromUserName === 'osl8HwPBTCsVbquNsnYbUfOQH8sM') {
                switch(input) {
                    case '同步微信用户':
                        msg = await this.syncWechat();
                        break;
                    case '发送邮件':
                        await this.scheduleService.dailyPost();
                        msg = '邮件群发成功';
                        break;
                    case '备份数据':
                        await this.scheduleService.backup();
                        msg = '数据备份成功';
                        break;
                }
            }
        }
        res.reply(msg);
    }
    private async recommendPost(url: string, openid: string): Promise<any> {
        let output:any = {};
        // 是否有规则
        let parseRule = await this.ruleService.findByUrl(url);
        try {
            if (parseRule) {
                output = await this.parserService.html(url, parseRule);
            } else {
                output = await this.parserService.mercury(url);
            }
        } catch (error) {
            output = await this.parserService.data(url);
        }
        output.url = url;
        await this.postService.insert(output, openid);
        return [{
            title: output.title,
            description: output.description,
            picurl: output.thumb,
            url: output.url
        }];
    }
    private async syncWechat(): Promise<any> {
        const config = await this.configService.get();
        const WechatApi = new WechatMp(config.wechat.user, config.wechat.pass);
        try {
            await WechatApi.loginchk();
            return await this.wechatHandle(WechatApi);
        } catch (error) {
            // 发送登录认证地址
            let qrfilepath = await WechatApi.startlogin();
            let result = await WechatApi.qrdecode(qrfilepath);

            // 开始检测登录状态
            WechatApi.loginstep().then(() => {
                // 登录成功
                this.wechatHandle(WechatApi);
            });

            return result.text;
        }
    }
    // 成功登录微信，同步微信成员
    private async wechatHandle(WechatApi) {
        const userList = await WechatApi.user_list();
        const userDetails = await Promise.all(userList.map(user => {
            return WechatApi.user_info_detail(user.user_openid).then(userDetail => {
                return {
                    openid: userDetail.user_openid,
                    avatar: userDetail.user_head_img.replace(/^http:\/\//, 'https://'),
                    city: userDetail.user_city,
                    country: userDetail.user_country,
                    province: userDetail.user_province,
                    gender: userDetail.user_gender,
                    name: userDetail.user_name,
                    remark: userDetail.user_remark,
                    signature: userDetail.user_signature,
                    createTime: userDetail.user_create_time
                };
            });
        }));
        const users = await this.wechatService.sync(userDetails);
        return `${userDetails.length}个微信用户同步成功`;
    }
}
