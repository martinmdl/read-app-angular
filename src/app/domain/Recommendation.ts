import { Book } from "./Book"
import { RatingDTO } from "./Rating"

export interface RecommendationDTO {
  id: number,
  name: string,
  description: string,
  recommendedBooks: Array<string>,
  averageRating: number,
  numberOfBooks: number,
  readingTime: number,
  canRate: boolean,
  owner: boolean,
  private: boolean
  favorite: boolean
}

export interface RecommendationDetailsDTO {
  id: number,
  name: string,
  description: string,
  recommendedBooks: Array<Book>,
  averageRating: number,
  canRate: boolean,
  valoration: Array<RatingDTO>,
  private: boolean
}
