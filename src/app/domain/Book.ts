import { Lenguaje } from "./Language"

export type Book = {
  id: number /* | null */;
  bookTitle: string;
  authorName: string;
  pagesCount: number;
  wordsCount: number;
  languages: Lenguaje[];
  weekSales: number;
}