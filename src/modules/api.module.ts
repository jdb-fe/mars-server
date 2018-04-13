import { Module } from '@nestjs/common';

import { ApiController } from '../controllers/api.controller';
import { PostService } from '../services/post.service';

@Module({
    components: [PostService],
    controllers: [ApiController],
})
export class ApiModule {}
