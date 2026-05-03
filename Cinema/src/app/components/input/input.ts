import { Component, Input, forwardRef, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Component({
  selector: 'app-form-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './input.html',
  styleUrl: './input.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormInput),
      multi: true
    }
  ]
})
export class FormInput implements ControlValueAccessor {
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
  @Input() control: any; // For validation status
  @Input() fullWidth: boolean = false;
  @Input() isDropShadow: boolean = false;

  uniqueId = 'input-' + Math.random().toString(36).substring(2, 9);

  @ViewChild('nativeInput') nativeInput?: ElementRef<HTMLInputElement>;

  value: string = '';
  onChange: any = () => {};
  onTouched: any = () => {};

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  onModelChange(val: any) {
    this.value = val;
    this.onChange(val);
  }

  onInput(event: any) {
    this.value = event.target.value;
    this.onChange(this.value);
  }

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
    if (this.isMultiSelect) {
      const currentValues = Array.isArray(this.value) ? [...this.value] : [];
      const index = currentValues.indexOf(option);
      if (index > -1) {
        currentValues.splice(index, 1);
      } else {
        currentValues.push(option);
      }
      this.value = currentValues as any;
    } else {
      this.value = option;
      this.showDropdown = false;
    }
    this.onChange(this.value);
    this.onTouched();
  }

  showDropdown = false;
  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  isSelected(option: string): boolean {
    if (this.isMultiSelect && Array.isArray(this.value)) {
      return this.value.includes(option);
    }
    return this.value === option;
  }

  getDisplayValue(): string {
    if (this.isMultiSelect && Array.isArray(this.value)) {
      return this.value.length > 0 ? this.value.join(', ') : this.placeholder;
    }
    return this.value || this.placeholder;
  }
}
