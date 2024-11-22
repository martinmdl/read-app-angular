import { Component } from '@angular/core'
import { SidebarComponent } from '../../components/sidebar/sidebar.component'
import { CardRecomendationComponent } from '../../components/card-recomendation/card-recomendation.component'
import { RecommendationService } from '../../core/services/recommendation.service'
import { RecommendationDTO } from '../../domain/Recommendation'
import { Router } from '@angular/router'

@Component({
  selector: 'app-recomendaciones-avalorar-usuario',
  standalone: true,
  imports: [SidebarComponent, CardRecomendationComponent],
  templateUrl: './user-recommendation-rating.component.html',
  styleUrl: './user-recommendation-rating.component.scss'
})
export class RecomendacionesAValorarUsuarioComponent {
  currentRecommendations: RecommendationDTO[] | undefined

  constructor(
    private readonly recommendationService: RecommendationService,
    private readonly route: Router
  ) {}

  ngOnInit(): void {
    this.loadRecommendations()
  }

  async loadRecommendations() : Promise<void> {
    this.currentRecommendations = await this.recommendationService.getRecommendationsToValorate()
  }

  handleRefresh() {
    this.loadRecommendations()
  }
}
