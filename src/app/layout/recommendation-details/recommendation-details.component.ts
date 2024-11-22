import { Component, Input } from '@angular/core'
import { ActivatedRoute, Router, RouterLink, RouterOutlet} from '@angular/router'
import { RecommendationService } from '../../core/services/recommendation.service'
import { RecommendationDetailsDTO } from '../../domain/Recommendation'
import { CommonModule, Location  } from '@angular/common'
import { CardBookComponent } from '../../components/card-book/card-book.component'
import Swal from 'sweetalert2'


@Component({
	selector: 'app-detalle-recomendacion',
	standalone: true,
	imports: [RouterOutlet, CommonModule, CardBookComponent, RouterLink],
	templateUrl: './recommendation-details.component.html',
	styleUrl: './recommendation-details.component.scss'
})
export class DetalleRecomendacionComponent {

	@Input() id!: number
	recommendation?: RecommendationDetailsDTO
	
	constructor(private readonly recomendationServices: RecommendationService, private readonly router: Router, private readonly route: ActivatedRoute, private readonly location: Location ) {}

	ngOnInit() {
		this.route.params.subscribe((params) => {
			this.id = +params['id'] 
			this.loadRecommendationDetails(this.id) 
		})
	}

	loadRecommendationDetails(id: number){
		this.recomendationServices.getRecommendationsDetails(id).subscribe({
			next: (recommendation) => {
			  this.recommendation = recommendation 
			},
			error: (err) => {
			  console.error('Error fetching recommendation details:', err)
			  this.navegarAHome() 
			}
		})
	}

	async createValoration(idRecomendation: number){
		const { value: formValues } = await Swal.fire({
            title: 'Añadir Valoración',
            html: `
                <input type="number" id="value" class="swal2-input swal-input" placeholder="Puntaje">
                <input type="text" id="comment" class="swal2-input swal-input" placeholder="Comentario">
            `,
            focusConfirm: false,
            showCancelButton: true,
            cancelButtonText: "Cancelar",
            reverseButtons: true,
            confirmButtonText: "Actualizar",
            confirmButtonColor: '#1975d1',
            preConfirm: () => {
                const value = +(document.getElementById('value') as HTMLInputElement).value
                const comment = (document.getElementById('comment') as HTMLInputElement).value
				
                if (!value || !comment) {
                    Swal.showValidationMessage('Por favor, completa todos los campos')
                    return false
                }
				else if(value < 0 || value > 5) {
					Swal.showValidationMessage('El valor debe ser un numero entre 0 y 5')
					return false
				}
                return { value, comment }
            },
        })

		if (formValues) {
			formValues.value = +formValues.value
  			await this.recomendationServices.createValoration(idRecomendation, formValues)	
			this.loadRecommendationDetails(idRecomendation)	
        }
	}

	navegarAHome() {
		this.router.navigate(['/busqueda-principal'])
	}
	regresar() {
		this.location.back()
	}
}
