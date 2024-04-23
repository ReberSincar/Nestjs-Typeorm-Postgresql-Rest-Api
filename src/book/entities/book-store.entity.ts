import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { Book } from './book.entity';

@Entity()
export class BookStore extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  website: string;

  @OneToMany(() => Book, (e) => e.storeId)
  books: Book[];

  @CreateDateColumn()
  createdAt: Date;
}
