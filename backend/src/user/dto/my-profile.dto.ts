import { CoreOutput } from "../../common/dtos/core.output";
import { User } from "../entities/user.entity";

export class MyProfileOutput extends CoreOutput {
    user?: User;
}