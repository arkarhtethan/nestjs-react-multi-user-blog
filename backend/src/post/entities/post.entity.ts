import { Type } from "class-transformer";
import { IsBoolean, IsNotEmpty, IsString } from "class-validator";
import { CoreEntity } from "src/common/entities/core.entity";
import { User } from "src/user/entities/user.entity";
import { BeforeInsert, Column, Entity, ManyToOne } from "typeorm";
import { Category } from "./category.entity";

@Entity()
export class Post extends CoreEntity {

    @Column({ type: Boolean, default: false })
    @IsBoolean()
    @Type(() => Boolean)
    published?: boolean;

    @Column({ type: String })
    @IsString()
    @IsNotEmpty()
    @Type(() => String)
    title: string;

    @Column({ type: String })
    @IsString()
    @IsNotEmpty()
    @Type(() => String)
    summary: string;

    @Column({ type: String })
    @IsString()
    @IsNotEmpty()
    @Type(() => String)
    image: string;

    @Column({ type: String })
    @IsString()
    @IsNotEmpty()
    @Type(() => String)
    content: string;

    @Column({ type: String })
    @IsString()
    @IsNotEmpty()
    @Type(() => String)
    slug: string;

    @ManyToOne(() => User, user => user.posts)
    user: User;

    @ManyToOne(() => Category, category => category.posts)
    category: Category;

    @BeforeInsert()
    generateSlug () {
        this.slug = this.title.toLowerCase().replace(/ /g, '');
    }
}
