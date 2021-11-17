import { CreateDateColumn, Index, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Type } from 'class-transformer';
import { IsNumber } from "class-validator";

export class CoreEntity {

    @PrimaryGeneratedColumn()
    @Index()
    @Type(type => Number)
    @IsNumber()
    id: number;

    @CreateDateColumn({ select: true })
    @Type(type => Date)
    createdAt: Date;

    @UpdateDateColumn({ select: false })
    @Type(type => Date)
    updatedAt: Date;

}