import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-form-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './input.html',
  styleUrl: './input.css'
})
export class FormInput {
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() type: string = 'text';
  @Input() name: string = '';
  @Input() errorMsg: string = '';
  @Input() isTextarea: boolean = false;
  @Input() iconUrl: string = '';
  @Input() isSelect: boolean = false;
  @Input() isMultiSelect: boolean = false;
  @Input() options: string[] = [];
  @Input() control: any;
  @Input() fullWidth: boolean = false;
  @Input() isDropShadow: boolean = false;

  uniqueId = 'input-' + Math.random().toString(36).substring(2, 9);
  
  @ViewChild('nativeInput') nativeInput?: ElementRef<HTMLInputElement>;

  openPicker() {
    if (this.type === 'date' && this.nativeInput?.nativeElement?.showPicker) {
      try {
        this.nativeInput.nativeElement.showPicker();
      } catch (e) {
        console.error('Browser does not support programmatic showPicker()', e);
      }
    }
  }

  toggleOption(option: string) {
    if (!this.control) return;
    
    if (this.isMultiSelect) {
      const currentValues = Array.isArray(this.control.value) ? [...this.control.value] : [];
      const index = currentValues.indexOf(option);
      if (index > -1) {
        currentValues.splice(index, 1);
      } else {
        currentValues.push(option);
      }
      this.control.setValue(currentValues);
    } else {
      this.control.setValue(option);
      this.showDropdown = false;
    }
    this.control.markAsTouched();
  }

  showDropdown = false;
  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  isSelected(option: string): boolean {
    if (!this.control) return false;
    if (this.isMultiSelect && Array.isArray(this.control.value)) {
      return this.control.value.includes(option);
    }
    return this.control.value === option;
  }

  getDisplayValue(): string {
    if (!this.control) return this.placeholder;
    if (this.isMultiSelect && Array.isArray(this.control.value)) {
      return this.control.value.length > 0 ? this.control.value.join(', ') : this.placeholder;
    }
    return this.control.value || this.placeholder;
  }
}
