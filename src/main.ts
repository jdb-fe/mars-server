import * as express from 'express';
import * as path from 'path';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common'

import { AppModule } from './modules/app.module';

(async () => {
    const app = await NestFactory.create(AppModule);

    app.use(express.static(path.join(__dirname, 'public')));
    app.set('views', __dirname + '/views');
    app.set('view engine', 'pug');
    app.disable('x-powered-by');
    app.useGlobalPipes(new ValidationPipe());
    await app.listen(3000);
})();
