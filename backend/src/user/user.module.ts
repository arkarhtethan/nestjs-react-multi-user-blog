import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtModule } from 'src/jwt/jwt.module';
import { Verification } from './entities/verification.entity';
import { JwtService } from 'src/jwt/jwt.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Verification
    ]),
    JwtModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule { }
