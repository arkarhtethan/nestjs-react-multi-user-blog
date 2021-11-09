import { Type } from "class-transformer";
import { CoreEntity } from "src/common/entities/core.entity";
import { BeforeInsert, Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { User } from "./user.entity";
import { v4 as uuid } from "uuid";

@Entity()
export class Verification extends CoreEntity {
    @Column()
    @Type(type => String)
    code: string;

    @OneToOne(type => User, { onDelete: "CASCADE" })
    @JoinColumn()
    user: User;

    @BeforeInsert()
    createCode (): void {
        this.code = uuid() + Date.now();
    }
}