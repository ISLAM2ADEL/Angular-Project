import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToasterService } from '../../services/toaster.service';

@Component({
  selector: 'app-toaster',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toaster.html',
  styleUrl: './toaster.css'
})
export class Toaster {
  constructor(public toasterService: ToasterService) {}
}
