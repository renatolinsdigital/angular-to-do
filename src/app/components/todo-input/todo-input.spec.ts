import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TodoInput } from './todo-input';

describe('TodoInput', () => {
  let fixture: ComponentFixture<TodoInput>;
  let input: HTMLInputElement;
  let form: HTMLFormElement;
  let emitted: string[];

  async function submit(text: string) {
    input.value = text;
    input.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    form.dispatchEvent(new Event('submit', { cancelable: true }));
    await fixture.whenStable();
  }

  beforeEach(async () => {
    fixture = TestBed.createComponent(TodoInput);
    emitted = [];
    fixture.componentInstance.add.subscribe((content) => emitted.push(content));
    await fixture.whenStable();

    input = fixture.nativeElement.querySelector('input');
    form = fixture.nativeElement.querySelector('form');
  });

  it('emits the trimmed text and clears the input', async () => {
    await submit('  Write docs  ');

    expect(emitted).toEqual(['Write docs']);
    expect(input.value).toBe('');
  });

  it('ignores blank submissions', async () => {
    await submit('   ');

    expect(emitted).toEqual([]);
  });
});
