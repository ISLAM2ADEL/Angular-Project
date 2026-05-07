import { Component, inject, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatbotService } from '../../services/chatbot';

interface ChatMessage {
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

@Component({
  selector: 'app-chat-bot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-bot.html',
  styleUrls: ['./chat-bot.css']
})
export class ChatBot implements OnDestroy {
  isOpen: boolean = false;
  newMessage: string = '';

  private chatbotService = inject(ChatbotService);
  private cdr = inject(ChangeDetectorRef);

  messages: ChatMessage[] = [
    { text: 'Hello there, how can I help you today sir!', sender: 'bot', timestamp: new Date() }
  ];

  toggleChat() {
    this.isOpen = !this.isOpen;
  }

  constructor() {
    window.addEventListener('open-cinebot', this.handleOpenCinebot);
  }

  private handleOpenCinebot = () => {
    this.isOpen = true;
    this.cdr.detectChanges();
  };

  ngOnDestroy(): void {
    window.removeEventListener('open-cinebot', this.handleOpenCinebot);
  }

  formatMessage(text: string): string {
    if (!text) return '';
    let formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    formatted = formatted.replace(/\n/g, '<br>');
    return formatted;
  }

  sendMessage() {
    if (this.newMessage.trim() === '') return;

    const userText = this.newMessage;

    this.messages.push({
      text: userText,
      sender: 'user',
      timestamp: new Date()
    });

    this.newMessage = '';

    this.chatbotService.sendMessage(userText).subscribe({
      next: (response) => {
        const rawBotText = response.data.reply || response.reply || 'No response';

        const cleanText = this.formatMessage(rawBotText);

        this.messages.push({
          text: cleanText,
          sender: 'bot',
          timestamp: new Date()
        });

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Chatbot API Error:', err);
        this.messages.push({
          text: 'Oops! Error connecting to the server.',
          sender: 'bot',
          timestamp: new Date()
        });
        this.cdr.detectChanges();
      }
    });
  }
}
