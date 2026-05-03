import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { FormInput } from '../input/input';
import { Categories } from '../../enums/Categories';
import { ToasterService } from '../../services/toaster.service';

@Component({
  selector: 'app-add-movie',
  standalone: true,
  imports: [CommonModule, FormsModule, FormInput],
  templateUrl: './add-movie.html',
  styleUrl: './add-movie.css'
})
export class AddMovie {
  @Output() close = new EventEmitter<void>();

  movie = {
    name: '',
    title: '',
    duration: '',
    category: '',
    description: '',
    dateTime: '',
    showTimes: [] as string[],
    thumbnail: ''
  };

  categories = Object.values(Categories);
  showTimesOptions = ['10:00 AM', '01:00 PM', '04:00 PM', '07:00 PM', '10:00 PM'];

  constructor(private toaster: ToasterService) {}

  onClose() {
    this.close.emit();
  }

  onSubmit() {
    console.log('Movie Added:', this.movie);
    this.toaster.success(`Movie "${this.movie.title || this.movie.name}" added successfully!`);
    this.onClose();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.movie.thumbnail = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }
}
