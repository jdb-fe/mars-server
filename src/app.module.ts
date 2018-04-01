import { Module } from '@nestjs/common';

import { PostModule } from './post/post.module';

@Module({
  imports: [],
  controllers: [

  ],
  components: [],
  modules: [
    PostModule
  ]
})
export class AppModule {}
