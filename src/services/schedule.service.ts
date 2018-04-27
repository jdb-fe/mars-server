import { Component } from '@nestjs/common';
import * as Schedule from 'node-schedule';
import 'reflect-metadata';

import { PostService } from './post.service';
import { ConfigService } from './config.service';

import { Cron } from '../decorators/cron.decorator';

import { sendMail } from '../utils/utils';
import * as pug from 'pug';
import * as path from 'path';
import * as moment from 'moment';

import { execSync } from 'child_process';
import { getConnectionOptions } from 'typeorm';
import * as fs from 'fs';

@Component()
export class ScheduleService {
    private jobs = {};
    constructor(
        private readonly configService: ConfigService,
        private readonly postService: PostService,
    ) {}
    start() {
        const jobNames: string[] = Reflect.getMetadataKeys(this);
        jobNames.forEach(jobName => {
            let rule = Reflect.getMetadata(jobName, this);
            this.jobs[jobName] = Schedule.scheduleJob(rule, this[jobName].bind(this));
        });
    }
    stop(jobName?: string) {
        if (jobName) {
            this.jobs[jobName] && this.jobs[jobName].cancel();
        } else {
            for (let jobName in this.jobs) {
                this.jobs[jobName].cancel();
            }
        }
    }
    @Cron({ hour: 10, minute: 0, second: 0 })
    async dailyPost() {
        const compileFunc = pug.compileFile(
            path.join(__dirname, '..', 'views', 'daily.pug'),
        );
        const config = await this.configService.get();
        const posts = await this.postService.find({ push: 0 });
        const date = moment().format('YYYY-MM-DD');
        await sendMail(config, compileFunc({ date, posts }));
        if (posts.length) {
            // 更新已推送
            this.postService.update(posts.map(post => post.id), {
                push: 1,
            });
        }
    }
    @Cron({ hour: 17, minute: 0, second: 0 })
    async backup() {
        const today = moment().format('YYYY-MM-DD');
        const connectionOptions:any = await getConnectionOptions();
        const filepath = `./backup-${connectionOptions.database}-${today}.sql.gz`;
        let config = await this.configService.get();
        execSync(`mysqldump -u${connectionOptions.username} -p${connectionOptions.password} ${connectionOptions.database} | gzip > ${filepath}`);
        config.subscriber = ['bukas@qq.com'];
        await sendMail(config, '<h1>Mars Daily Mysql Backup</h1>', 'Mars Daily Backup', [{
            path: filepath
        }]);
        fs.unlinkSync(filepath);
    }
}
