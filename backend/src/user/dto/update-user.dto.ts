import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CoreOutput } from '../../common/dtos/core.output';
import { User } from '../entities/user.entity';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(OmitType(CreateUserDto, ['password'])) { }

export class UpdateUserOutput extends CoreOutput {
    user?: User;
}