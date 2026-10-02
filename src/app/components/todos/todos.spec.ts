import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Todo } from '../../models/todo.model';
import { Todos } from './todos';

describe('Todos', () => {
  let fixture: ComponentFixture<Todos>;
  let element: HTMLElement;

  const todos: Todo[] = [
    { id: 3, content: 'Open', isCompleted: false },
    { id: 7, content: 'Done', isCompleted: true },
  ];

  beforeEach(async () => {
    fixture = TestBed.createComponent(Todos);
    fixture.componentRef.setInput('todos', todos);
    element = fixture.nativeElement;
    await fixture.whenStable();
  });

  it('renders one item per todo and marks completed ones', () => {
    const items = element.querySelectorAll('.todo');
    const checkboxes = Array.from(element.querySelectorAll<HTMLInputElement>('.toggle'));

    expect(items.length).toBe(2);
    expect(items[0].classList).not.toContain('done');
    expect(items[1].classList).toContain('done');
    expect(checkboxes.map((checkbox) => checkbox.checked)).toEqual([false, true]);
  });

  it('emits the todo id on toggle and on delete', () => {
    const toggled: number[] = [];
    const removed: number[] = [];
    fixture.componentInstance.toggleComplete.subscribe((id) => toggled.push(id));
    fixture.componentInstance.remove.subscribe((id) => removed.push(id));

    const second = element.querySelectorAll('.todo')[1];
    second.querySelector<HTMLInputElement>('.toggle')!.click();
    second.querySelector<HTMLButtonElement>('.delete')!.click();

    expect(toggled).toEqual([7]);
    expect(removed).toEqual([7]);
  });

  it('names each delete button after its todo', () => {
    const labels = Array.from(element.querySelectorAll('.delete')).map((button) =>
      button.getAttribute('aria-label'),
    );

    expect(labels).toEqual(['Delete Open', 'Delete Done']);
  });

  it('shows a message when there are no todos', async () => {
    fixture.componentRef.setInput('todos', []);
    await fixture.whenStable();

    expect(element.querySelectorAll('.todo').length).toBe(0);
    expect(element.querySelector('.empty')?.textContent).toContain('Nothing to do');
  });
});
