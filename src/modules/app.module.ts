import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { IndexController } from '../controllers/index.controller';

import { PostModule } from './post.module';

@Module({
    imports: [
        TypeOrmModule.forRoot(),
        PostModule
    ],
    controllers: [IndexController]
})
export class AppModule { }
