import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { ToDo } from 'src/app/models';

@Component({
  selector: 'app-todo-input',
  templateUrl: './todo-input.component.html',
  styleUrls: ['./todo-input.component.scss']
})
export class TodoInputComponent implements OnInit {

  todoText = '';
  @Input() todos: ToDo[] = [];
  @Output() addEvent = new EventEmitter<ToDo>();

  constructor() { }

  onAdd() {
    if (this.todoText === '') return;
    const lastToDo = [...this.todos].reverse()[0];
    const newToDoId = lastToDo ? lastToDo.id + 1 : 0;

    const newTodo: ToDo = {
      id: newToDoId,
      isCompleted: false,
      content: this.todoText
    }

    this.todoText = '';
    this.addEvent.emit(newTodo);
  }

  ngOnInit(): void { }

}
