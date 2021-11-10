import { Type } from "class-transformer";
import { IsString, IsNotEmpty } from "class-validator";
import { CoreEntity } from "src/common/entities/core.entity";
import { BeforeInsert, Column, Entity, Index, OneToMany } from "typeorm";
import { Post } from "./post.entity";

@Entity()
export class Category extends CoreEntity {

    @Column({ type: String, unique: true })
    @IsString()
    @Index()
    @IsNotEmpty()
    @Type(() => String)
    name: string;

    @Column({ type: String, unique: true })
    @IsString()
    @IsNotEmpty()
    @Index()
    @Type(() => String)
    slug: string;

    @OneToMany(() => Post, post => post.category)
    posts: Post[];

    @BeforeInsert()
    generateSlug () {
        this.slug = this.name.toLowerCase().replace(/ /g, '');
    }
}