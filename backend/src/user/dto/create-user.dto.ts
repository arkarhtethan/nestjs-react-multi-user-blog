import { PickType } from "@nestjs/mapped-types";
import { CoreOutput } from "../../common/dtos/core.output";
import { User } from "../entities/user.entity";

export class CreateUserDto extends PickType(User, [
    'name',
    'password',
    'email',
]) { }

export class CreateUserOutput extends CoreOutput { }