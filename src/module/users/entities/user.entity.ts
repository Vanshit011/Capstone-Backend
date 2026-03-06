import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';

import { Exclude } from 'class-transformer';
import { BaseEntity } from '../../../common/entities/base.entity';

@Entity('users')
export class User extends BaseEntity {
  @ApiProperty({ description: 'The unique identifier of the user' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'The name of the user', maxLength: 100 })
  @Column({ length: 100 })
  name: string;

  @ApiProperty({ description: 'The email of the user', uniqueItems: true })
  @Column({ unique: true })
  email: string;

  @ApiProperty({ description: 'The password of the user' })
  @Exclude()
  @Column({ type: 'text' })
  password: string;
}
