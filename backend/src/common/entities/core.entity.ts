import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Transform, Type } from 'class-transformer';
import { IsNumber } from "class-validator";

export class CoreEntity {

    @PrimaryGeneratedColumn()
    @Type(type => Number)
    @IsNumber()
    id: number;

    @CreateDateColumn({ select: false })
    @Type(type => Date)
    createdAt: Date;

    @UpdateDateColumn({ select: false })
    @Type(type => Date)
    updatedAt: Date;

}