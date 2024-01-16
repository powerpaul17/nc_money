import { ref, type Ref } from 'vue';

let bookStore: BookStore | null = null;

export const useBookStore = (): BookStore => {
  if (!bookStore) bookStore = new BookStore();
  return bookStore;
};

export function resetBookStore(): void {
  bookStore = null;
}

class BookStore {
  public readonly books: Ref<Array<Book>> = ref([]);

  public insertBook(book: Book): void {
    this.books.value.push(book);
  }

  public deleteBook(bookId: number): void {
    const index = this.books.value.findIndex((b) => b.id === bookId);
    if (index >= 0) {
      this.books.value.splice(index, 1);
    }
  }
}

export type Book = {
  id: number;
  name: string;
  description: string;
};
