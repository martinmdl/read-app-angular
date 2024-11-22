import { Component, EventEmitter, Input, Output } from '@angular/core'
import { CommonModule } from '@angular/common'
import { Book } from '../../domain/Book'
import { TruncatePipe } from '../../core/pipes/truncate.pipe'

@Component({
  selector: 'app-card-book',
  standalone: true,
  imports: [CommonModule, TruncatePipe],
  templateUrl: './card-book.component.html',
  styleUrl: './card-book.component.scss'
})

export class CardBookComponent {
    @Input() libro!: Book
    @Input() deleteBtn: boolean = false
    @Output() delete  = new EventEmitter<number>()

    deleteBook(): void | null {
        if (this.libro.id !== null && this.libro.id !== undefined) {
            this.delete.emit(this.libro.id)
        }
    }
}
