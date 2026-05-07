import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-feature-card',
  imports: [],
  templateUrl: './feature-card.html',
  styleUrl: './feature-card.css',
})
export class FeatureCard {
  @Input() iconUrl !: string;
  @Input() featureName !: string;
  @Input() featureDescription !: string;
}
