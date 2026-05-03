import { Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ChatBot } from "./components/chat-bot/chat-bot";
import { Header } from "./components/header/header";
import { Footer } from "./components/footer/footer";
@Component({
  selector: 'app-root',
  imports: [RouterModule, ChatBot, Header, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Cinema');
  get isUserLoggedIn(): boolean {
    return !!localStorage.getItem('token'); 
  }
}
