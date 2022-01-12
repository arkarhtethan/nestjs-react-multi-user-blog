import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Joi from 'joi';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from './jwt/jwt.module';
import { PostModule } from './post/post.module';
import { UserModule } from './user/user.module';
import { CommentModule } from './comment/comment.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: process.env.NODE_ENV === "dev" ? ".env.dev" : "",
      isGlobal: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('dev', 'production', 'test')
          .required(),
        PRIVATE_KEY: Joi.string().required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.string(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        ELASTIC_NODE: Joi.string().required(),
        ELASTICSEARCH_INDEX: Joi.string().required(),
      }),
    }),
    // TypeOrmModule.forRoot({
    //   logging: true,
    //   type: 'postgres',
    //   host: process.env.DB_HOST,
    //   username: process.env.DB_USERNAME,
    //   password: process.env.DB_PASSWORD,
    //   database: process.env.DB_NAME,
    //   entities: [User, Verification, Post, Category, Comment],
    //   synchronize: true,
    // }),
    TypeOrmModule.forRoot(),
    UserModule,
    PostModule,
    JwtModule.forRoot({ privateKey: process.env.PRIVATE_KEY }),
    AuthModule,
    CommentModule,
    // SearchModule,
  ]
})
export class AppModule { }
