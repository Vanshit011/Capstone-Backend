import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './module/auth/auth.module';
import { UsersModule } from './module/users/users.module';
import { DatabaseModule } from './database/database.module';

import { ConfigModule } from '@nestjs/config';
import { PostsModule } from './module/posts/posts.module';
import { CommentsModule } from './module/comments/comments.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `env/.env.${process.env.NODE_ENV || 'development'}`,
    }),
    UsersModule,
    AuthModule,
    DatabaseModule,
    PostsModule,
    CommentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
