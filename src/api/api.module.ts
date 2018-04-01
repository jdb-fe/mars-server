import { Module } from '@nestjs/common';

import { ApiController } from './api.controller';
import { PostService } from '../post/post.service';

@Module({
    components: [PostService],
    controllers: [ApiController],
})
export class ApiModule {}
