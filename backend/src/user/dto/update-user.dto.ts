import { OmitType, PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsString } from 'class-validator';
import { CoreOutput } from '../../common/dtos/core.output';
import { User } from '../entities/user.entity';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(OmitType(CreateUserDto, ['password'])) {
    @IsString()
    @IsOptional()
    bio: string;
}

export class UpdateUserOutput extends CoreOutput {
    user?: User;
}