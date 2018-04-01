import * as express from 'express';
import * as path from 'path';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { ValidationPipe } from './common/pipes/validation.pipe';

(async () => {
    const app = await NestFactory.create(AppModule);

    app.use(express.static(path.join(__dirname, 'public')));
    app.set('views', __dirname + '/views');
    app.set('view engine', 'pug');

    app.useGlobalPipes(new ValidationPipe());
    await app.listen(3000);
})();
