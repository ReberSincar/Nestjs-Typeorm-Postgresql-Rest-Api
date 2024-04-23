import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Put,
  ParseIntPipe,
} from '@nestjs/common';
import { BookService } from './book.service';
import { UpdateStockDto } from './dto/update-stock.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { PageOptionsDto } from 'src/common/pagination/page-meta.dto';
import { CreateBookStoreDto } from './dto/create-book-store.dto';
import { CreateBookDto } from './dto/create-book.dto';
import { SearchBookDto } from './dto/search-book.dto';
import { GetBooksDto } from './dto/get-books.dto';

@Controller('books')
@ApiBearerAuth()
@ApiTags('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post('stores')
  @Roles(Role.ADMIN)
  createBookStore(@Body() body: CreateBookStoreDto) {
    return this.bookService.createBookStore(body);
  }

  @Get('stores')
  @Roles(Role.USER)
  getStores(@Query() pageOptions: PageOptionsDto) {
    return this.bookService.getStores(pageOptions);
  }

  @Post()
  @Roles(Role.ADMIN)
  createBook(@Body() body: CreateBookDto) {
    return this.bookService.createBook(body);
  }

  @Get()
  @Roles(Role.USER)
  getBooksInStore(@Query() getBooksQuery: GetBooksDto) {
    return this.bookService.getBooksInStore(getBooksQuery);
  }

  @Get('search')
  @Roles(Role.USER)
  searchBooks(@Query() searchBookQuery: SearchBookDto) {
    return this.bookService.searchBooks(searchBookQuery);
  }

  @Put(':id/stock')
  @Roles(Role.ADMIN, Role.STORE_MANAGER)
  updateBookStock(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateStockDto,
  ) {
    return this.bookService.updateBookStock(id, body);
  }
}
