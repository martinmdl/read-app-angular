import { Component, Input } from '@angular/core'
import { RecommendationDetailsDTO} from '../../domain/Recommendation'
import { RecommendationService } from '../../core/services/recommendation.service'
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router'
import { CommonModule, Location } from '@angular/common'
import { CardBookComponent } from '../../components/card-book/card-book.component'
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms'
import { take } from 'rxjs'
import Swal from 'sweetalert2'
import { Book } from '../../domain/Book'
import { BookService } from '../../core/services/book.service'

@Component({
  selector: 'app-edicion-recomendacion',
  standalone: true,
  imports: [FormsModule ,RouterOutlet, CommonModule, CardBookComponent, RouterLink, ReactiveFormsModule],
  templateUrl: './recommendation-edition.component.html',
  styleUrl: './recommendation-edition.component.scss'
})
export class EdicionRecomendacionComponent {

  @Input() id!: number 
  recommendation?: RecommendationDetailsDTO
  recommendationForm !: FormGroup

	constructor(private readonly bookServices: BookService, private readonly recomendationServices: RecommendationService, private readonly router: Router, private readonly route: ActivatedRoute, private readonly location: Location ) {}

	ngOnInit() {
    this.route.params.pipe(take(1)).subscribe((params) => {
			this.recomendationServices.getRecommendationsDetails(+params['id']).pipe(take(1)).subscribe({
				next: (reco) => {
              this.recommendation = reco
              this.id = this.recommendation.id
              this.recommendationForm = new FormGroup({
              name: new FormControl(this.recommendation.name),
              private: new FormControl(this.recommendation.private),
              description: new FormControl(this.recommendation.description)
            })
				},
				error: (err) => {
					console.error('Error fetching recommendation:', err)
					this.navegarAHome()
				}
			})
		})
	}

  navegarAHome() {
    this.router.navigate(['/busqueda-principal'])
  }

  eliminarLibroSwal(id: number) {
    Swal.fire({
        title: `Seguro que quiere eliminar este libro?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        reverseButtons: true,
        confirmButtonText: "Eliminar"
    }).then(async (result) => {
        if (result.isConfirmed) {
          await this.deleteBook(id)
        }
      })
  }

  async deleteBook(idBook: number){
    await this.bookServices.deleteBookInRecommendation(this.recommendation!.id, idBook)
    this.recommendation!.recommendedBooks = this.recommendation!.recommendedBooks.filter(book => book.id !== idBook)
  }

  async save(){
    if (this.recommendationForm.valid) {
            
      const updatedRecommendationDetails: RecommendationDetailsDTO = {
        id: this.recommendation!.id,
        name: this.recommendationForm.value.name,
        description: this.recommendationForm.value.description,
        recommendedBooks: this.recommendation!.recommendedBooks,
        averageRating: this.recommendation!.averageRating,
        canRate: this.recommendation!.canRate,
        valoration: this.recommendation!.valoration,
        private: this.recommendationForm.value.private,
      }
      await this.recomendationServices.putRecommendationEdition(this.id, updatedRecommendationDetails)
      Swal.fire({
        position: "center",
        icon: "success",
        title: 'Recomendacion Actualizada!',
        showConfirmButton: false,
        timer: 1200
      })

    } 
    else {
        console.log('El formulario no es válido')
    }
  }

  cancelSave(){
    this.location.back()
    Swal.fire({
      position: "center",
      icon: "warning",
      title: 'Operacion cancelada!',
      showConfirmButton: false,
      timer: 1200
    })
  }

  async viewAddBooks(idReco: number){
    const books = await this.bookServices.getBooksInRecommendation(idReco)
    const recommendBooksID = this.recommendation?.recommendedBooks.map(book => book.id)
    const booksAvailable = books.filter(book => !recommendBooksID!.includes(book.id))
    
    if(this.hasMoreBooksToAdd(booksAvailable)){
      this.sweetAlertAddBooks(booksAvailable)
    }else{
      this.alertNoAvailableBooks()
    }
  }

  hasMoreBooksToAdd(books: Book[]){
    return books.length > 0 
  }

  async sweetAlertAddBooks(books: Book[]){

    Swal.fire({
      title: 'Lista de Libros',
      html: 
      `<ul style="display: flex; flex-direction: column; gap: 1rem">
         ${books.map(
          book => 
          `<li>
            <button style="font-size: 1rem; cursor: pointer; width: 50%; height: 2rem" id="${book.id}">
              ${book.bookTitle}
            </button>
          </li>`).join('')
        }
      </ul>`,  
      showCloseButton: true,
      confirmButtonColor: '#5EADE1',
      confirmButtonText: 'Cerrar',
      didOpen: () => {
        books.forEach(book => {
          const button = document.getElementById(`${book.id}`)
          if (button) {
            button.addEventListener('click', async () => {
              await this.addBook(book)
              button.parentElement?.remove() //Elimina en el swal el boton del usuario en el momento que se toca 
            })
          }
        })
      }
    })
  }

  async addBook(book: Book){
    this.recommendation?.recommendedBooks.push(book)
  }

  alertNoAvailableBooks(){
    Swal.fire({
      title: 'No hay más libros',
      text: 'Todos los libros ya están en tu lista de libros leidos.',
      icon: 'info',
      confirmButtonColor: '#5EADE1',
    })
  }

}
