import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, CreateUserOutput } from './dto/create-user.dto';
import { UpdateUserDto, UpdateUserOutput } from './dto/update-user.dto';
import { GetUserDto, GetUserOutput } from './dto/get-user.dto';
import { LoginDto, LoginOutput } from './dto/login.dto';
import { Role } from '../auth/role.decorator';
import { AuthUser } from '../auth/auth-user.decorator';
import { User } from './entities/user.entity';
import { ChangePasswordDto, changePasswordOutput } from './dto/change-password.dto';
import { GetUsersOutput } from './dto/get-users.dto';
import { DeleteUserOutput } from './dto/delete-user.dto';
import { MyProfileOutput } from './dto/my-profile.dto';
import { VerifyEmailDto, VerifyEmailOutput } from './dto/verify-email.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post('/register')
  register (@Body() createUserDto: CreateUserDto): Promise<CreateUserOutput> {
    return this.userService.register(createUserDto);
  }


  @Post('login')
  login (@Body() loginDto: LoginDto): Promise<LoginOutput> {
    return this.userService.login(loginDto);
  }

  @Get()
  @Role(['Admin'])
  findAll (): Promise<GetUsersOutput> {
    return this.userService.findAll();
  }

  @Get('profile')
  @Role(['User', 'Admin'])
  myProfile (@AuthUser() user: User): Promise<MyProfileOutput> {
    return this.userService.myProfile(user);
  }

  @Role(['Admin'])
  @Get(':id')
  findOne (@Param() getUserDto: GetUserDto): Promise<GetUserOutput> {
    return this.userService.findOne(getUserDto);
  }

  @Patch()
  @Role(['User', 'Admin'])
  update (
    @Body() updateUserDto: UpdateUserDto,
    @AuthUser() user: User
  ): Promise<UpdateUserOutput> {
    return this.userService.update(updateUserDto, user);
  }

  @Patch('change-password')
  @Role(['User'])
  changePassword (
    @Body() changePasswordDto: ChangePasswordDto,
    @AuthUser() user: User
  ): Promise<changePasswordOutput> {
    return this.userService.changePassword(changePasswordDto, user);
  }

  @Delete()
  @Role(['User'])
  deleteAccount (@AuthUser() user: User): Promise<DeleteUserOutput> {
    return this.userService.deleteAccount(user);
  }

  @Get('/confirm/:code')
  verifyEmail (@Param() verifyEmailDto): Promise<VerifyEmailOutput> {
    return this.userService.verifyEmail(verifyEmailDto)
  }
}
