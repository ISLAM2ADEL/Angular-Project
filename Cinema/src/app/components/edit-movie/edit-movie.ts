import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormInput } from "../input/input";
import { Categories } from '../../enums/Categories';
import { ToasterService } from '../../services/toaster.service';

@Component({
  selector: 'app-edit-movie',
  standalone: true,
  imports: [CommonModule, FormsModule, FormInput],
  templateUrl: './edit-movie.html',
  styleUrl: '../add-movie/add-movie.css' // Reuse add-movie styles
})
export class EditMovie {
  @Input() set movieData(data: any) {
    if (data) {
      this.movie = {
        name: data.title || '',
        title: data.title || '',
        duration: data.duration || '',
        category: data.genre || '', // Map genre to category
        description: data.description || '',
        dateTime: this.formatDate(data.releaseDate) || '', // Map releaseDate to dateTime
        showTimes: Array.isArray(data.showTimes) ? data.showTimes : [],
        thumbnail: data.thumbnail || ''
      };
    }
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr; // Return as is if already formatted or invalid
    return date.toISOString().split('T')[0];
  }

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

  @Output() close = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }

  onSubmit() {
    console.log('Movie Updated:', this.movie);
    this.toaster.success(`Movie "${this.movie.title || this.movie.name}" updated successfully!`);
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
