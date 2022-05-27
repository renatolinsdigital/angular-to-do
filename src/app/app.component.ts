import { Component } from '@angular/core';
import { ToDo } from './models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  todos: ToDo[] = [];

  constructor() { }

  ngOnInit(): void {
    this.todos = [{
      id: 0,
      content: 'First to do',
      isCompleted: false
    },
    {
      id: 1,
      content: 'Second to do',
      isCompleted: true
    }]
  }

  onCompleteToggle(id: number) {
    this.todos = this.todos.map((todo) => {
      if (todo.id === id) todo.isCompleted = !todo.isCompleted
      return todo;
    });
  }

  onAdd(todo: ToDo) {
    this.todos.push(todo);
  }

  onDelete(id: number) {
    this.todos = this.todos.filter(todo => todo.id !== id);
  }

}

