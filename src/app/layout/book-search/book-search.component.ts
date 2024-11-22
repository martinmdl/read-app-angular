import { Component } from '@angular/core'
import { SearchBarComponent } from '../../components/search-bar/search-bar.component'
import { CardBookComponent } from '../../components/card-book/card-book.component'
import { Book } from '../../domain/Book'
import { SearchService } from '../../core/services/search.service'
import { BookService } from '../../core/services/book.service'

@Component({
  selector: 'app-busqueda-libros',
  standalone: true,
  imports: [SearchBarComponent, CardBookComponent],
  templateUrl: './book-search.component.html',
  styleUrl: './book-search.component.scss'
})

export class BusquedaLibrosComponent {

  currentBook: Book[] | undefined
  filterCurrentBook: Book[] | undefined
  currentSearchValue: string = ''

  constructor(private readonly BookService : BookService , private readonly searchService : SearchService) { }

  async ngOnInit(): Promise<void> {
    await this.loadBooks()
  }

  async loadBooks(): Promise<void> {
    this.filterCurrentBook = await this.BookService.getBooks()
  }

  handleSearch(data: {searchValue: string}): void {    
    this.searchService.filterbook({ ...data, privateCheck: null }).subscribe(books => {
      this.filterCurrentBook = books
    })
  }
}