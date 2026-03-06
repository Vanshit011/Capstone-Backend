import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';
import { Comment } from '../../comments/entities/comment.entity';

@Entity('posts')
export class Post extends BaseEntity {
  @ApiProperty({ description: 'The unique identifier of the post' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'The title of the post', maxLength: 255 })
  @Column({ length: 255 })
  title: string;

  @ApiProperty({ description: 'The content of the post' })
  @Column({ type: 'text' })
  content: string;

  @ApiProperty({
    description: 'The user who created the post',
    type: () => User,
  })
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @ApiProperty({ description: 'Comments on the post', type: () => [Comment] })
  @OneToMany(() => Comment, (comment: Comment) => comment.post)
  comments: Comment[];
}
