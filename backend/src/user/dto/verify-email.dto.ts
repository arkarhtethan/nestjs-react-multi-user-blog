import { PickType } from "@nestjs/mapped-types";
import { CoreOutput } from "src/common/dtos/core.output";
import { Verification } from "../entities/verification.entity";

export class VerifyEmailDto extends PickType(Verification, ['code']) { }

export class VerifyEmailOutput extends CoreOutput { }