import { useBookApiService, type BookCreationData } from './bookApiService';
import { useBookStore, type Book } from '../stores/bookStore';

let bookService: BookService | null = null;

export const useBookService = (): BookService => {
  if (!bookService) bookService = new BookService();
  return bookService;
};
class BookService {
  private bookStore = useBookStore();
  private bookApiService = useBookApiService();

  public async fetchBooks(): Promise<void> {
    const books = await this.bookApiService.getBooks();
    for (const book of books) {
      this.bookStore.insertBook(book);
    }
  }

  public async refreshBook(bookId: number): Promise<void> {
    const book = await this.bookApiService.getBook(bookId);
    this.bookStore.insertBook(book);
  }

  public async addBook(book: BookCreationData): Promise<Book> {
    const newBook = await this.bookApiService.addBook(book);
    this.bookStore.insertBook(newBook);

    return newBook;
  }

  public async updateBook(book: Book): Promise<void> {
    await this.bookApiService.updateBook(book);
  }

  public async deleteBook(bookId: number): Promise<void> {
    await this.bookApiService.deleteBook(bookId);
    this.bookStore.deleteBook(bookId);
  }
}
