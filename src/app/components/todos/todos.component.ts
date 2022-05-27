import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { ToDo } from './../../models';

@Component({
  selector: 'app-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.scss']
})

export class TodosComponent implements OnInit {
  @Input() todos: ToDo[] = [];
  @Output() deleteEvent = new EventEmitter<number>();
  @Output() toggleCompleteEvent = new EventEmitter<number>();

  constructor() { }

  ngOnInit(): void { }

  onCompleteToggle(id: number) {
    this.toggleCompleteEvent.emit(id);
  }

  onDelete(id: number) {
    this.deleteEvent.emit(id)
  }

}
