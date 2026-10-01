import { Component, signal } from '@angular/core';
import { TodoInput } from './components/todo-input/todo-input';
import { Todos } from './components/todos/todos';
import { Todo } from './models/todo.model';

const INITIAL_TODOS: Todo[] = [
  { id: 0, content: 'First to do', isCompleted: false },
  { id: 1, content: 'Second to do', isCompleted: true },
];

@Component({
  selector: 'app-root',
  imports: [TodoInput, Todos],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly todos = signal<Todo[]>(INITIAL_TODOS);
  private nextId = Math.max(-1, ...INITIAL_TODOS.map((todo) => todo.id)) + 1;

  protected add(content: string): void {
    const todo: Todo = { id: this.nextId++, content, isCompleted: false };
    this.todos.update((todos) => [...todos, todo]);
  }

  protected toggleComplete(id: number): void {
    this.todos.update((todos) =>
      todos.map((todo) => (todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo)),
    );
  }

  protected remove(id: number): void {
    this.todos.update((todos) => todos.filter((todo) => todo.id !== id));
  }
}
