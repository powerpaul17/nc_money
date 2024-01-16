import axios from '@nextcloud/axios';
import { generateUrl } from '@nextcloud/router';

import type { Book } from '../stores/bookStore';

let bookApiService: BookApiService | null = null;

export const useBookApiService = (): BookApiService => {
  if (!bookApiService) bookApiService = new BookApiService();
  return bookApiService;
};

class BookApiService {
  public async getBooks(): Promise<Array<Book>> {
    const response = await axios.get<Array<BookApiResponseData>>(
      generateUrl('apps/money/books')
    );

    return response.data;
  }

  public async getBook(bookId: number): Promise<Book> {
    const response = await axios.get<BookApiResponseData>(
      generateUrl(`apps/money/books/${bookId}`)
    );

    return response.data;
  }

  public async addBook(book: BookCreationData): Promise<Book> {
    const response = await axios.post<BookApiResponseData>(
      generateUrl('apps/money/books'),
      book
    );

    return response.data;
  }

  public async deleteBook(bookId: number): Promise<void> {
    await axios.delete(generateUrl(`apps/money/books/${bookId}`));
  }

  public async updateBook(book: Book): Promise<Book> {
    const response = await axios.put<BookApiResponseData>(
      generateUrl(`apps/money/books/${book.id}`),
      book
    );

    return response.data;
  }
}

export type BookCreationData = Omit<Book, 'id'>;

type BookApiResponseData = {
  id: number;
  name: string;
  description: string;
};
