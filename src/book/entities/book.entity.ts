import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BookStore } from './book-store.entity';

@Entity()
export class Book extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  author: string;

  @Column()
  publisher: string;

  @Column()
  genre: string;

  @Column()
  stock: number;

  @Column()
  price: number;

  @Column()
  storeId: number;

  @ManyToOne(() => BookStore)
  @JoinColumn({ name: 'storeId' })
  store: BookStore;

  @CreateDateColumn()
  createdAt: Date;
}
