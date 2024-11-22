import { Component } from '@angular/core'
import { SidebarComponent } from '../../components/sidebar/sidebar.component'
import { CardBookComponent } from '../../components/card-book/card-book.component'
import { Book } from '../../domain/Book'
import { BookService } from '../../core/services/book.service'
import Swal from 'sweetalert2'
import { CommonModule } from '@angular/common'

@Component({
  selector: 'app-libros-aleer-usuario',
  standalone: true,
  imports: [SidebarComponent, CardBookComponent, CommonModule],
  templateUrl: './user-book-to-read.component.html',
  styleUrl: './user-book-to-read.component.scss'
})
export class LibrosALeerUsuarioComponent {

  constructor(private readonly bookService: BookService){}

  booksToRead: Book[] = []

  async ngOnInit() {
    await this.updateBooksToRead()
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
          Swal.fire({
            title: "Libro eliminado exitosamente!",
            icon: "success",
            showConfirmButton: false,
            timer: 1200
          })
        }
      })
  }

  async deleteBook(id: number){
    await this.bookService.deleteBookToRead(id)
    await this.updateBooksToRead()
  }

  async viewAddBooks(){
    const books = await this.bookService.getBooksToAddToReadingList() 
    
    if(this.hasMoreBooksToRead(books)){
      this.sweetAlertAddBooks(books)
    }else{
      this.alertNoAvailableBooks()
    }
  }

  hasMoreBooksToRead(books: Book[]){
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
    await this.bookService.addBookToRead(book.id)
    await this.updateBooksToRead()
    Swal.fire({
      position: "center",
      icon: "success",
      title: 'Libro agregado exitosamente!',
      showConfirmButton: false,
      timer: 1200
    })
  }

  alertNoAvailableBooks(){
    Swal.fire({
      title: 'No hay más libros',
      text: 'Todos los libros ya están en tu lista de libros por leer y leidos.',
      icon: 'info',
      confirmButtonColor: '#5EADE1',
    })
  }

  async updateBooksToRead() {
    this.booksToRead = await this.bookService.getBooksToRead()
  }

}
