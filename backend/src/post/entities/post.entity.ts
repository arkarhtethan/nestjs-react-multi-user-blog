import { Type } from "class-transformer";
import { IsBoolean, IsNotEmpty, IsString } from "class-validator";
import { CoreEntity } from "../../common/entities/core.entity";
import { User } from "../../user/entities/user.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { Category } from "./category.entity";
import { Comment } from "src/comment/entities/comment.entity";

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

    @OneToMany(type => Comment, comment => comment.post)
    comments: Comment[];

    @BeforeInsert()
    @BeforeUpdate()
    generateSlug () {
        if (this.title) {
            this.slug = this.title.toLowerCase().replace(/ /g, '') + "-" + Date.now();
        }
    }
}
