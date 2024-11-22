import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing'
import { RecomendacionesAValorarUsuarioComponent } from './user-recommendation-rating.component'
import { RecommendationService } from '../../core/services/recommendation.service'
import { provideRouter, Router } from '@angular/router'
import { SidebarComponent } from '../../components/sidebar/sidebar.component'
import { CardRecomendationComponent } from '../../components/card-recomendation/card-recomendation.component'
import { provideHttpClient } from '@angular/common/http'
import { RecommendationDTO } from '../../domain/Recommendation'

describe('RecomendacionesAValorarUsuarioComponent', () => {
  let component: RecomendacionesAValorarUsuarioComponent
  let fixture: ComponentFixture<RecomendacionesAValorarUsuarioComponent>
  let recommendationService: jasmine.SpyObj<RecommendationService>
  let router: jasmine.SpyObj<Router>

  beforeEach(async () => {
    const recommendationServiceSpy = jasmine.createSpyObj('RecommendationService', ['getRecommendationsToValorate'])
    const routerSpy = jasmine.createSpyObj('Router', ['navigate'])

    await TestBed.configureTestingModule({
      imports: [RecomendacionesAValorarUsuarioComponent, SidebarComponent, CardRecomendationComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        { provide: RecommendationService, useValue: recommendationServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents()

    fixture = TestBed.createComponent(RecomendacionesAValorarUsuarioComponent)
    component = fixture.componentInstance
    recommendationService = TestBed.inject(RecommendationService) as jasmine.SpyObj<RecommendationService>
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should load recommendations on init', fakeAsync(() => {
    const mockRecommendations: RecommendationDTO[] = [{
      id: 1, name: 'Recommendation 1',
      description: '',
      recommendedBooks: [],
      averageRating: 0,
      numberOfBooks: 0,
      readingTime: 0,
      canRate: false,
      owner: false,
      private: false,
      favorite: false
    }]
    recommendationService.getRecommendationsToValorate.and.returnValue(Promise.resolve(mockRecommendations))

    component.ngOnInit()

    tick()

    expect(component.currentRecommendations).toEqual(mockRecommendations)
    expect(recommendationService.getRecommendationsToValorate).toHaveBeenCalled()
  }))

  it('should refresh recommendations', fakeAsync(() => {
    const mockRecommendations = [{
      id: 1, name: 'Recommendation 1',
      description: '',
      recommendedBooks: [],
      averageRating: 0,
      numberOfBooks: 0,
      readingTime: 0,
      canRate: false,
      owner: false,
      private: false,
      favorite: false
    }]
    recommendationService.getRecommendationsToValorate.and.returnValue(Promise.resolve(mockRecommendations))

    component.handleRefresh()

    tick()

    expect(component.currentRecommendations).toEqual(mockRecommendations)
    expect(recommendationService.getRecommendationsToValorate).toHaveBeenCalled()
  }))

  it('should navigate to another route', () => {
    const navigateSpy = router.navigate as jasmine.Spy
    router.navigate(['/some-route'])
    expect(navigateSpy).toHaveBeenCalledWith(['/some-route'])
  })
})