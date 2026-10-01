import { ComponentFixture, TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  let fixture: ComponentFixture<App>;
  let element: HTMLElement;

  const todoItems = () => Array.from(element.querySelectorAll<HTMLLIElement>('.todo'));
  const todoTexts = () =>
    todoItems().map((item) => item.querySelector('.content')?.textContent?.trim());

  beforeEach(async () => {
    fixture = TestBed.createComponent(App);
    element = fixture.nativeElement;
    await fixture.whenStable();
  });

  it('renders the title and the initial todos', () => {
    expect(element.querySelector('h1')?.textContent).toContain('To do List');
    expect(todoTexts()).toEqual(['First to do', 'Second to do']);
  });

  it('adds a todo submitted through the input', async () => {
    const input = element.querySelector('input')!;
    input.value = 'Buy milk';
    input.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    element.querySelector('form')!.dispatchEvent(new Event('submit', { cancelable: true }));
    await fixture.whenStable();

    expect(todoTexts()).toEqual(['First to do', 'Second to do', 'Buy milk']);
    expect(todoItems()[2].querySelector('.id')?.textContent?.trim()).toBe('2');
  });

  it('toggles a todo when its content is clicked', async () => {
    todoItems()[0].querySelector<HTMLButtonElement>('.content')!.click();
    await fixture.whenStable();

    expect(todoItems()[0].classList).toContain('done');
  });

  it('removes a todo when its delete button is clicked', async () => {
    todoItems()[0].querySelector<HTMLButtonElement>('.delete')!.click();
    await fixture.whenStable();

    expect(todoTexts()).toEqual(['Second to do']);
  });
});
