import { TestBed } from '@angular/core/testing'
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing'
import { SearchService } from './search.service'
import { RecommendationDTO } from '../../domain/Recommendation'
import { Book } from '../../domain/Book'
import { provideHttpClient } from '@angular/common/http'
import { Lenguaje } from '../../domain/Language'

describe('SearchService', () => {
  let service: SearchService
  let httpMock: HttpTestingController

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [provideHttpClient(), provideHttpClientTesting(), SearchService]
    })
    service = TestBed.inject(SearchService)
    httpMock = TestBed.inject(HttpTestingController)
  })

  afterEach(() => {
    httpMock.verify()
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })

  it('should filter recommendations', () => {
    const mockRecommendations: RecommendationDTO[] = [
      {
        id: 1,
        name: 'string',
        description: 'string',
        recommendedBooks: [],
        averageRating: 0,
        numberOfBooks: 0,
        readingTime: 0,
        canRate: false,
        owner: true,
        private: true,
        favorite: false
      },
      {
        id: 2,
        name: 'string',
        description: 'string',
        recommendedBooks: [],
        averageRating: 0,
        numberOfBooks: 0,
        readingTime: 0,
        canRate: false,
        owner: true,
        private: true,
        favorite: false
      }
    ]

    const requestData = { searchValue: 'test', privateCheck: true }

    service.filterRecommendations(requestData).subscribe(recommendations => {
      expect(recommendations.length).toBe(2)
      expect(recommendations).toEqual(mockRecommendations)
    })

    const req = httpMock.expectOne('http://localhost:8080/api/filterRecommendation')
    expect(req.request.method).toBe('POST')
    req.flush(mockRecommendations)
  })

  it('should filter books', () => {
    const mockBooks: Book[] = [
      {
        id: 1,
        bookTitle: 'string',
        authorName: 'string',
        pagesCount: 45,
        wordsCount: 45,
        languages: [Lenguaje.ar_SA],
        weekSales: 125
      },
      {
        id: 2,
        bookTitle: 'string',
        authorName: 'string',
        pagesCount: 45,
        wordsCount: 45,
        languages: [Lenguaje.ar_SA],
        weekSales: 125
      }
    ]

    const requestData = { searchValue: 'test', privateCheck: false }

    service.filterbook(requestData).subscribe(books => {
      expect(books.length).toBe(2)
      expect(books).toEqual(mockBooks)
    })

    const req = httpMock.expectOne('http://localhost:8080/api/filterBook')
    expect(req.request.method).toBe('POST')
    req.flush(mockBooks)
  })
})