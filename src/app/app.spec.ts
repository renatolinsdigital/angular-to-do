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

  it('links the author name to LinkedIn in a new tab', () => {
    const link = element.querySelector<HTMLAnchorElement>('.footer a')!;

    expect(link.textContent?.trim()).toBe('Renato Lins');
    expect(link.href).toBe('https://www.linkedin.com/in/renatolinsdigital');
    expect(link.target).toBe('_blank');
    expect(element.querySelector('.footer')?.textContent).toContain(
      'Developed for teaching purposes',
    );
  });

  it('adds a todo submitted through the input', async () => {
    const input = element.querySelector('input')!;
    input.value = 'Buy milk';
    input.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    element.querySelector('form')!.dispatchEvent(new Event('submit', { cancelable: true }));
    await fixture.whenStable();

    expect(todoTexts()).toEqual(['First to do', 'Second to do', 'Buy milk']);
  });

  it('marks a todo as done and back when its checkbox is clicked', async () => {
    const checkbox = () => todoItems()[0].querySelector<HTMLInputElement>('.toggle')!;

    checkbox().click();
    await fixture.whenStable();

    expect(todoItems()[0].classList).toContain('done');
    expect(checkbox().checked).toBe(true);

    checkbox().click();
    await fixture.whenStable();

    expect(todoItems()[0].classList).not.toContain('done');
    expect(checkbox().checked).toBe(false);
  });

  it('toggles a todo when its text is clicked', async () => {
    todoItems()[0].querySelector<HTMLElement>('.text')!.click();
    await fixture.whenStable();

    expect(todoItems()[0].classList).toContain('done');
  });

  it('removes a todo when its delete button is clicked', async () => {
    todoItems()[0].querySelector<HTMLButtonElement>('.delete')!.click();
    await fixture.whenStable();

    expect(todoTexts()).toEqual(['Second to do']);
  });
});
