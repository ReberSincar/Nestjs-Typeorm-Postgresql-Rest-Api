import { Injectable } from '@nestjs/common';
import { BookStore } from './entities/book-store.entity';
import { notFound } from 'src/common/errors';
import {
  PageDto,
  PageMetaDto,
  PageOptionsDto,
} from 'src/common/pagination/page-meta.dto';
import { CreateBookStoreDto } from './dto/create-book-store.dto';
import { UpdateStockDto } from './dto/update-stock.dto';
import { CreateBookDto } from './dto/create-book.dto';
import { Book } from './entities/book.entity';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, Like } from 'typeorm';
import { BookStockOperation } from './enums/book-stock-operation.enum';
import { SearchBookDto } from './dto/search-book.dto';
import { GetBooksDto } from './dto/get-books.dto';

@Injectable()
export class BookService {
  constructor(@InjectDataSource() private dataSource: DataSource) {}
  async createBookStore(body: CreateBookStoreDto) {
    return BookStore.save({ ...body });
  }

  async createBook(body: CreateBookDto) {
    await this.getStoreById(body.storeId);
    return Book.save({ ...body });
  }

  async getStoreById(id: number) {
    const store = await BookStore.findOneBy({ id });
    if (!store) return notFound('Store not found');
    return store;
  }

  async getBookById(id: number) {
    const book = await Book.findOneBy({ id });
    if (!book) return notFound('Book not found');
    return book;
  }

  async getStores(pageOptions: PageOptionsDto) {
    const result = await BookStore.findAndCount({
      skip: pageOptions.skip,
      take: pageOptions.take,
      order: {
        ['createdAt']: pageOptions.order,
      },
    });

    const meta = new PageMetaDto({
      itemCount: result[1],
      pageOptionsDto: pageOptions,
    });
    return new PageDto(result[0], meta);
  }

  async getBooksInStore(getBooksQuery: GetBooksDto) {
    const store = await this.getStoreById(getBooksQuery.store);

    const result = await Book.findAndCount({
      skip: getBooksQuery.skip,
      take: getBooksQuery.take,
      where: {
        storeId: store.id,
      },
      order: {
        ['createdAt']: getBooksQuery.order,
      },
    });

    const meta = new PageMetaDto({
      itemCount: result[1],
      pageOptionsDto: getBooksQuery,
    });
    return new PageDto(result[0], meta);
  }

  async searchBooks(searchBookQuery: SearchBookDto) {
    const result = await Book.findAndCount({
      where: {
        title: Like(`%${searchBookQuery.searchKey}%`),
      },
      relations: { store: true },
      skip: searchBookQuery.skip,
      take: searchBookQuery.take,
      order: {
        ['createdAt']: searchBookQuery.order,
      },
    });

    const meta = new PageMetaDto({
      itemCount: result[1],
      pageOptionsDto: searchBookQuery,
    });
    return new PageDto(result[0], meta);
  }

  async updateBookStock(id: number, body: UpdateStockDto) {
    const book = await this.getBookById(id);
    if (body.operation === BookStockOperation.ADD) {
      book.stock += body.quantity;
    } else {
      book.stock -= body.quantity;
    }
    return book.save();
  }
}
