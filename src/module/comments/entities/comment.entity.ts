import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';
import { Post } from '../../posts/entities/post.entity';

@Entity('comments')
export class Comment extends BaseEntity {
  @ApiProperty({ description: 'The unique identifier of the comment' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'The content of the comment' })
  @Column({ type: 'text' })
  content: string;

  @ApiProperty({
    description: 'The user who created the comment',
    type: () => User,
  })
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @ApiProperty({
    description: 'The post the comment belongs to',
    type: () => Post,
  })
  @ManyToOne(() => Post, (post: Post) => post.comments, { onDelete: 'CASCADE' })
  post: Post;
}
