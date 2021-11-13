import { IsString, MinLength } from "class-validator";
import { CoreEntity } from "src/common/entities/core.entity";
import { Post } from "src/post/entities/post.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";

@Entity()
export class Comment extends CoreEntity {

    @ManyToOne(type => User, user => user.comments, { onDelete: "CASCADE" })
    user: User;

    @IsString()
    @MinLength(10)
    @Column({ type: String, nullable: false })
    text: string;

    @ManyToOne(type => Post, post => post.comments, { onDelete: "CASCADE" })
    post: Post;

    @ManyToOne(type => Comment, comment => comment.children)
    parent: Comment;

    @OneToMany(type => Comment, comment => comment.parent)
    children: Comment[];

}
