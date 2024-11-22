import { Component } from '@angular/core'
import { NavigationEnd, Router, RouterOutlet } from '@angular/router'
import { HeaderComponent } from '../../components/header/header.component'
import { SearchBarComponent } from '../../components/search-bar/search-bar.component'
import { RecommendationDTO } from '../../domain/Recommendation'
import { RecommendationService } from '../../core/services/recommendation.service'
import { CardRecomendationComponent } from '../../components/card-recomendation/card-recomendation.component'
import { LoginService } from '../../core/services/login.service'
import { SearchService } from '../../core/services/search.service'

@Component({
  selector: 'app-busqueda-principal',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    SearchBarComponent,
    CardRecomendationComponent
  ],
  templateUrl: './recommendation-search.component.html',
  styleUrl: './recommendation-search.component.scss'
})
export class BusquedaPrincipalComponent {
  currentRecommendations: RecommendationDTO[] | undefined
  filterCurrentRecommendations: RecommendationDTO[] | undefined
  currentSearchValue: string = ''
  animationOn = false

  ngOnInit(): void {
    this.loadRecommendations()
    this.updateView()
  }

  constructor(
    private readonly router: Router,
    private readonly recommendationService: RecommendationService,
    public loginService: LoginService,
    private readonly searchService: SearchService
  ) {}

  private loadRecommendations(): void {
    this.recommendationService
      .getAllRecommendations()
      .subscribe((recommendations) => {
        this.currentRecommendations = recommendations
        this.loadCurrentRecommendations()
      })
  }

  private loadCurrentRecommendations(): void {
    this.filterCurrentRecommendations = this.currentRecommendations
  }

  private updateView() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.loadRecommendations()
      }
    })
  }

  handleSearch(data: { searchValue: string }): void {
    this.searchService
      .filterRecommendations({ ...data, privateCheck: null })
      .subscribe((recommendations) => {
        this.filterCurrentRecommendations = recommendations
      })
  }

  EsPadre() {
    return this.router.url === '/busqueda-principal'
  }

  ownRecommendationValidation(item: RecommendationDTO) {
    return item.owner
  }

  canAssessValidation(item: RecommendationDTO) {
    return item.canRate
  }

  handleRefresh(): void {
    this.loadRecommendations()
  }
}
