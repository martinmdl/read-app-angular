import { Lenguaje } from "./Language"
import { Book } from './Book'

export type id = number | null;
export interface Autor {
  id: id;
  nombre: string;
  apellido: string;
  seudonimo: string;
  fechaNacimiento: Date;
  librosEscritos: Book[];
  lenguaNativa: Lenguaje;
  premios: number;
}
