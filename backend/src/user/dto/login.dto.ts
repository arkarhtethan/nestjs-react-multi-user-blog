import { PickType } from "@nestjs/mapped-types";
import { CoreOutput } from "../../common/dtos/core.output";
import { User } from "../entities/user.entity";

export class LoginDto extends PickType(User, ['email', 'password']) { }

export class LoginOutput extends CoreOutput {
    token?: string;
    user?: User;
}