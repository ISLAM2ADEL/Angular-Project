import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.html',
  styleUrl: './button.css',
  host: {
  '[style.display]': '"block"',
  '[style.width]': 'fullWidth() ? "100%" : "fit-content"',
},
})
export class Button {
  label = input('');
  iconPath = input('');
  variant = input<'primary' | 'secondary' | 'icon-only'>('primary');
  fullWidth = input(false);
  disabled = input(false);
  btnClick = output<void>();

  onClick() {
    if (this.disabled()) return;
    this.btnClick.emit();
  }
}
