import { createDB, type Database } from 'blinkdb';

let database: Database|null = null;

export function useBlinkDB(): Database {
  if (!database) {
    database = createDB({
      clone: false
    });
  }

  return database;
}
