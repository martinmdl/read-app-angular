import { Component } from '@angular/core'
import { CardRecomendationComponent } from '../../components/card-recomendation/card-recomendation.component'
import { SearchBarComponent } from '../../components/search-bar/search-bar.component'
import { RecommendationService } from '../../core/services/recommendation.service'
import { RecommendationDTO } from '../../domain/Recommendation'
import { CommonModule } from '@angular/common'
import { SearchService } from '../../core/services/search.service'

@Component({
  selector: 'app-mis-recomendaciones',
  standalone: true,
  imports: [CardRecomendationComponent,SearchBarComponent, CommonModule],
  templateUrl: './own-recommendation.component.html',
  styleUrls: ['./own-recommendation.component.scss']
})
export class MisRecomendacionesComponent {

  currentRecommendations: RecommendationDTO[] | undefined
  filterCurrentRecommendations: RecommendationDTO[] | undefined
  currentSearchValue: string = ''
  privateRecommendations: boolean = false
  constructor(private readonly recommendationService: RecommendationService, private readonly searchService : SearchService) {}

  ngOnInit(): void {
    this.loadRecommendations()
  }
  
  handleSearch(data: { searchValue: string, privateCheck: boolean }): void {
    this.searchService.filterRecommendations(data).subscribe(recommendations => {
      this.filterCurrentRecommendations = recommendations
    })
  }

  loadRecommendations(): void {
    this.recommendationService.getOwnRecommendations().subscribe(recommendations => {
      this.currentRecommendations = recommendations
      this.loadCurrentRecommendations()
    })
  }

  loadCurrentRecommendations(): void {
    this.filterCurrentRecommendations = this.currentRecommendations
  }
  
  handleRefresh(): void {
    this.loadRecommendations()
  }
}
