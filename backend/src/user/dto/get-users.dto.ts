import { CoreOutput } from "../../common/dtos/core.output";
import { User } from "../entities/user.entity";

export class GetUsersOutput extends CoreOutput {
    users?: User[];
}