import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { TodosComponent } from './components/todos/todos.component';
import { TodoInputComponent } from './components/todo-input/todo-input.component';

@NgModule({
  declarations: [ // For components
    AppComponent, TodosComponent, TodoInputComponent
  ],
  imports: [ // For modules
    BrowserModule,
    FormsModule
  ],
  providers: [], // For services
  bootstrap: [AppComponent] // The main component - to be loaded first
})
export class AppModule { }

// What are Angular modules: A mechanism to group components, directives, pipes and services that are related,
// in such a way that can be combined with other modules to create an application
