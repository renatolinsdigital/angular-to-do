import { Component, output, signal } from '@angular/core';

@Component({
  selector: 'app-todo-input',
  templateUrl: './todo-input.html',
  styleUrl: './todo-input.scss',
})
export class TodoInput {
  readonly add = output<string>();

  protected readonly text = signal('');

  protected submit(event: SubmitEvent): void {
    event.preventDefault();

    const content = this.text().trim();
    if (!content) return;

    this.add.emit(content);
    this.text.set('');
  }
}
