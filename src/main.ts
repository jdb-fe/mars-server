import * as express from 'express';
import * as path from 'path';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { json, urlencoded } from 'body-parser';

import { AppModule } from './modules/app.module';

import * as moment from 'moment';
moment.locale('zh-cn');

import * as session from 'express-session';
import Config from './config';

(async () => {
    const exprs = express();
    exprs.locals.moment = moment;
    const app = await NestFactory.create(AppModule, exprs, {});
    app.use(json(Config.bodyParser));
    app.use(urlencoded(Config.bodyParser));
    app.use('/static', express.static(path.join(__dirname, 'public')));
    app.setBaseViewsDir(path.join(__dirname, 'views'));
    app.setViewEngine('pug');
    app.disable('x-powered-by');
    app.useGlobalPipes(new ValidationPipe());
    app.use(session(Config.session));
    await app.listen(Config.port);
})();
