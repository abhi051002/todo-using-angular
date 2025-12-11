import { Component, inject, model, signal, Signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgClass } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import {MatTooltipModule} from '@angular/material/tooltip';

interface Todo {
  id: number;
  description: string;
  done: boolean;
}

@Component({
  selector: 'app-root',
  imports: [
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatCardModule,
    MatCheckboxModule,
    FormsModule,
    NgClass,
    CommonModule,
    MatDialogModule,
    MatTooltipModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  todoList = signal<Todo[]>([]);
  readonly dialog = inject(MatDialog);

  description = model('');
  selectedIndex:number = -1;
  save(): void {
    const obj: Todo = {
      description: this.description().trim(),
      done: false,
      id: this.todoList().length + 1,
    };
    if (this.selectedIndex >= 0 && this.selectedIndex !== null && this.selectedIndex !== undefined) {
      this.todoList()[this.selectedIndex].description = this.description().trim();
      this.selectedIndex = -1;
    } else {
      this.todoList().push(obj);
    }
    this.description.set('');
  }
  checkMarkChanged(index: number): void {
    this.todoList()[index].done = !this.todoList()[index].done;
  }
  deleteConfirmation(index: number): void {
    this.dialog
      .open(ConfirmationComponent)
      .afterClosed()
      .subscribe((res: any) => {
        if (res === 'YES') {
          this.todoList().splice(index, 1);
        }
      });
  }
  edit(index: number, item: Todo) {
    this.selectedIndex = index;
    this.description.set(item.description);
  }

  clear(){
    this.selectedIndex = -1;
    this.description.set('');
  }
}
