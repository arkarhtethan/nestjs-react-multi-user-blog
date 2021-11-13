import { InternalServerErrorException } from "@nestjs/common";
import { Type } from "class-transformer";
import { IsBoolean, IsEmail, IsEnum, IsString, MinLength } from "class-validator";
import { CoreEntity } from "../../common/entities/core.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany } from "typeorm"
import * as bcrypt from 'bcryptjs';
import { Post } from "../../post/entities/post.entity";
import { Comment } from "src/comment/entities/comment.entity";

export enum UserRole {
    User = 'User',
    Admin = 'Admin',
}

@Entity()
export class User extends CoreEntity {

    @Column({ unique: true, nullable: false })
    @IsString()
    @Type(() => String)
    username: string;

    @Column({ nullable: false })
    @IsString()
    @Type(() => String)
    name: string;

    @Column({ select: false })
    @IsString()
    @MinLength(6)
    @Type(() => String)
    password: string;

    @Column({ unique: true })
    @IsEmail()
    @Type(() => String)
    email: string;

    @Column({ type: 'enum', enum: UserRole, default: UserRole.User })
    @IsEnum(UserRole)
    role: UserRole;

    @Column({ default: false, select: false })
    @Type(type => Boolean)
    @IsBoolean()
    verified: boolean;

    @OneToMany(() => Post, post => post.user)
    posts: Post[];

    @OneToMany(() => Comment, comment => comment.user)
    comments: Comment[];

    @BeforeInsert()
    async createUsername () {
        if (this.name) {
            this.username = `${this.name.toLocaleLowerCase().replace(/ /g, '')}${Date.now()}`
        }
    }

    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword (): Promise<void> {
        if (this.password) {
            try {
                this.password = await bcrypt.hash(this.password, 10);
            } catch (e) {
                throw new InternalServerErrorException();
            }
        }
    }

    async checkPassword (aPassword: string): Promise<boolean> {
        try {
            return await bcrypt.compare(aPassword, this.password);
        } catch (e) {
            throw new InternalServerErrorException();
        }
    }
}
