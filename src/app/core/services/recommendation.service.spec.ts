import { fakeAsync, TestBed, tick } from '@angular/core/testing'
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing'
import { RecommendationService } from './recommendation.service'
import { RecommendationDTO, RecommendationDetailsDTO } from '../../domain/Recommendation'
import { provideHttpClient } from '@angular/common/http'

describe('RecommendationService', () => {
  let service: RecommendationService
  let httpMock: HttpTestingController

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [provideHttpClient(),provideHttpClientTesting(),RecommendationService]
    })
    service = TestBed.inject(RecommendationService)
    httpMock = TestBed.inject(HttpTestingController)
  })

  afterEach(() => {
    httpMock.verify()
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })

  it('should fetch recommendation by id', () => {
    const dummyRecommendation: RecommendationDTO = { 
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
    }

    service.getRecommendationById(1).subscribe(recommendation => {
      expect(recommendation).toEqual(dummyRecommendation)
    })
    const req = httpMock.expectOne('http://localhost:8080/api/RecommendationById/1')
    expect(req.request.method).toBe('GET')
    req.flush(dummyRecommendation)
  })

  it('should fetch recommendation details by id', () => {
    const dummyDetails: RecommendationDetailsDTO = { 
      id: 1,
      name: 'string',
      description: 'string',
      recommendedBooks: [],
      averageRating: 0,
      canRate: false,
      valoration: [],
      private: true
     }
    service.getRecommendationsDetails(1).subscribe(details => {
      expect(details).toEqual(dummyDetails)
    })
    const req = httpMock.expectOne('http://localhost:8080/api/recommendationDetails/1')
    expect(req.request.method).toBe('GET')
    req.flush(dummyDetails)
  })

  it('should fetch own recommendations', () => {
    const dummyRecommendations: RecommendationDTO[] = [{  
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
      favorite: false }]

    service.getOwnRecommendations().subscribe(recommendations => {
      expect(recommendations).toEqual(dummyRecommendations)
    })

    const req = httpMock.expectOne('http://localhost:8080/api/ownRecommendations')
    expect(req.request.method).toBe('GET')
    req.flush(dummyRecommendations)
  })

  it('should fetch all recommendations', () => {
    const dummyRecommendations: RecommendationDTO[] = [{ 
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
      favorite: false }]

    service.getAllRecommendations().subscribe(recommendations => {
      expect(recommendations).toEqual(dummyRecommendations)
    })

    const req = httpMock.expectOne('http://localhost:8080/api/allRecommendations')
    expect(req.request.method).toBe('GET')
    req.flush(dummyRecommendations)
  })

  it('should delete a recommendation', fakeAsync( () => {
    service.deleteRecommendation(1)

    tick()

    const req = httpMock.expectOne('http://localhost:8080/api/deleteRecommendations/1')
    expect(req.request.method).toBe('DELETE')
    req.flush(null)
  }))
})
