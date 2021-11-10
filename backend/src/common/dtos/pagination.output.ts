import { Type } from "class-transformer";
import { IsNumber, IsOptional } from "class-validator";

export class PaginationOutput {
    pages: number;
    currentPage: number;
    count: number;
    totalItems: number;
}

export class PaginationInput {
    @IsNumber()
    @Type(() => Number)
    @IsOptional()
    pageNumber?: number;

    @IsNumber()
    @Type(() => Number)
    @IsOptional()
    limit?: number;
}
