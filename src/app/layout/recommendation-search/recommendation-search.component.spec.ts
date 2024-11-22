import { ComponentFixture, TestBed } from '@angular/core/testing'

import { BusquedaPrincipalComponent } from './recommendation-search.component'
import { provideHttpClient } from '@angular/common/http'
import { provideRouter, RouterOutlet } from '@angular/router'
import { RecommendationService } from '../../core/services/recommendation.service'
import { LoginService } from '../../core/services/login.service'
import { SearchService } from '../../core/services/search.service'
import { RecommendationDTO } from '../../domain/Recommendation'
import { of } from 'rxjs'

describe('BusquedaPrincipalComponent', () => {
  let component: BusquedaPrincipalComponent
  let fixture: ComponentFixture<BusquedaPrincipalComponent>
  let recommendationServiceSpy: jasmine.SpyObj<RecommendationService>
  let loginServiceSpy: jasmine.SpyObj<LoginService>
  let searchServiceSpy: jasmine.SpyObj<SearchService>

  beforeEach(async () => {
    recommendationServiceSpy = jasmine.createSpyObj('RecommendationService', ['getAllRecommendations'])
    loginServiceSpy = jasmine.createSpyObj('LoginService', ['isLoggedIn'])
    searchServiceSpy = jasmine.createSpyObj('SearchService', ['filterRecommendations'])

    recommendationServiceSpy.getAllRecommendations.and.returnValue(of([]))

    await TestBed.configureTestingModule({
      imports: [BusquedaPrincipalComponent],
      providers: [RouterOutlet, provideHttpClient(), provideRouter([]),
        { provide: RecommendationService, useValue: recommendationServiceSpy },
        { provide: LoginService, useValue: loginServiceSpy },
        { provide: SearchService, useValue: searchServiceSpy },]
    })
      .compileComponents()

    fixture = TestBed.createComponent(BusquedaPrincipalComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should load recommendations', () => {
    expect(recommendationServiceSpy.getAllRecommendations).toHaveBeenCalled()
  })

  it('should load current recommendations', () => {
    const recommendations: RecommendationDTO[] = [{ 
      id: 4,
      name: 'string',
      description: 'string',
      recommendedBooks: [],
      averageRating: 123,
      numberOfBooks: 0,
      readingTime: 0,
      canRate: false,
      owner: true,
      private: true,
      favorite: false
     }]

    recommendationServiceSpy.getAllRecommendations.and.returnValue(of(recommendations))
    component.ngOnInit()
    expect(component.filterCurrentRecommendations).toEqual(recommendations)
  })

  it('should update the view on navigation end event. Up to 2, first on init, second on route event', () => {
    const recommendationsMock: RecommendationDTO[] = [{ 
      id: 4,
      name: 'string',
      description: 'string',
      recommendedBooks: [],
      averageRating: 123,
      numberOfBooks: 0,
      readingTime: 0,
      canRate: false,
      owner: true,
      private: true,
      favorite: false
     }]

    recommendationServiceSpy.getAllRecommendations.and.returnValue(of(recommendationsMock))

    component.ngOnInit()
    expect(recommendationServiceSpy.getAllRecommendations).toHaveBeenCalledTimes(2) 
  })

  it('should filter recommendations based on search value', () => {
    const filteredRecommendationsMock: RecommendationDTO[] = [{ 
      id: 4,
      name: 'string',
      description: 'string',
      recommendedBooks: [],
      averageRating: 123,
      numberOfBooks: 0,
      readingTime: 0,
      canRate: false,
      owner: true,
      private: true,
      favorite: false
     }]

    searchServiceSpy.filterRecommendations.and.returnValue(of(filteredRecommendationsMock))

    component.handleSearch({ searchValue: 'test' })

    expect(searchServiceSpy.filterRecommendations).toHaveBeenCalledWith({ searchValue: 'test', privateCheck: null })
    expect(component.filterCurrentRecommendations).toEqual(filteredRecommendationsMock)
  })

  it('should return true if the item is owned by the user', () => {
    const recommendationMock: RecommendationDTO = { 
      id: 4,
      name: 'string',
      description: 'string',
      recommendedBooks: [],
      averageRating: 123,
      numberOfBooks: 0,
      readingTime: 0,
      canRate: false,
      owner: true,
      private: true,
      favorite: false
     }
    expect(component.ownRecommendationValidation(recommendationMock)).toBeTrue()
  })

  it('should return false if the item is not owned by the user', () => {
    const recommendationMock: RecommendationDTO = { 
      id: 4,
      name: 'string',
      description: 'string',
      recommendedBooks: [],
      averageRating: 123,
      numberOfBooks: 0,
      readingTime: 0,
      canRate: false,
      owner: false,
      private: true,
      favorite: false
     }
    expect(component.ownRecommendationValidation(recommendationMock)).toBeFalse()
  })

  it('should return true if the item can be rated', () => {
    const recommendationMock: RecommendationDTO = { 
      id: 4,
      name: 'string',
      description: 'string',
      recommendedBooks: [],
      averageRating: 123,
      numberOfBooks: 0,
      readingTime: 0,
      canRate: true,
      owner: true,
      private: true,
      favorite: false
     }
    expect(component.canAssessValidation(recommendationMock)).toBeTrue()
  })

  it('should return false if the item cannot be rated', () => {
    const recommendationMock: RecommendationDTO = {
      id: 4,
      name: 'string',
      description: 'string',
      recommendedBooks: [],
      averageRating: 123,
      numberOfBooks: 0,
      readingTime: 0,
      canRate: false,
      owner: false,
      private: true,
      favorite: false
     }
    expect(component.canAssessValidation(recommendationMock)).toBeFalse()
  })

  it('should reload recommendations', () => {
    const recommendationsMock: RecommendationDTO[] = [{ 
      id: 4,
      name: 'string',
      description: 'string',
      recommendedBooks: [],
      averageRating: 123,
      numberOfBooks: 0,
      readingTime: 0,
      canRate: false,
      owner: true,
      private: true,
      favorite: false
     }]
    recommendationServiceSpy.getAllRecommendations.and.returnValue(of(recommendationsMock))

    component.handleRefresh()

    expect(recommendationServiceSpy.getAllRecommendations).toHaveBeenCalled()
    expect(component.currentRecommendations).toEqual(recommendationsMock)
  })
})
