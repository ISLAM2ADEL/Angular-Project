import { Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Header } from "./components/header/header";
import { Footer } from "./components/footer/footer";
import { Toaster } from './components/toaster/toaster';

@Component({
  imports: [RouterModule, Header, Footer, Toaster],
  selector: "app-root",
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Cinema');
}
