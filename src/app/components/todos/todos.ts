import { Component, input, output } from '@angular/core';
import { Todo } from '../../models/todo.model';

@Component({
  selector: 'app-todos',
  templateUrl: './todos.html',
  styleUrl: './todos.scss',
})
export class Todos {
  readonly todos = input.required<Todo[]>();
  readonly toggleComplete = output<number>();
  readonly remove = output<number>();
}
