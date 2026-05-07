import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Checkout } from './checkout';
import { By } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { provideRouter } from '@angular/router';

describe('Checkout Component', () => {
  let component: Checkout;
  let fixture: ComponentFixture<Checkout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Checkout, CommonModule],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(Checkout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the checkout component', () => {
    expect(component).toBeTruthy();
  });

  describe('Component Structure & Data Binding', () => {
    it('should display the correct movie title', () => {
      const titleElement = fixture.debugElement.query(By.css('.movie-title')).nativeElement;
      expect(titleElement.textContent).toContain('Interstellar Echoes');
    });

    it('should display the correct total amount', () => {
      const totalAmountElement = fixture.debugElement.query(By.css('.total-amount')).nativeElement;
      // Note: The total is 73.50, but with the currency pipe it might be $73.50. Let's check for "73.50"
      expect(totalAmountElement.textContent).toContain('73.50');
    });

    it('should have the Header and Footer components rendered', () => {
      const header = fixture.debugElement.query(By.css('app-header'));
      const footer = fixture.debugElement.query(By.css('app-footer'));
      expect(header).toBeTruthy();
      expect(footer).toBeTruthy();
    });

    it('should display the correct number of payment options', () => {
      const paymentOptions = fixture.debugElement.queryAll(By.css('.payment-option'));
      expect(paymentOptions.length).toBe(2);
    });
  });

  describe('Styling & Responsiveness Classes', () => {
    it('should apply the checkout-wrapper class for layout constraint', () => {
      const wrapperElement = fixture.debugElement.query(By.css('.checkout-wrapper'));
      expect(wrapperElement).toBeTruthy();
      // Ensure it has the wrapper class that governs the max-width and responsiveness
      expect(wrapperElement.nativeElement.classList.contains('checkout-wrapper')).toBe(true);
    });

    it('should apply flex layout classes on the main-content container', () => {
      const mainContentElement = fixture.debugElement.query(By.css('.main-content'));
      expect(mainContentElement).toBeTruthy();
      // The CSS relies on this class for flex-direction: column and gap: 1.5rem
      expect(mainContentElement.nativeElement.classList.contains('main-content')).toBe(true);
    });

    it('should apply the card class for styling individual sections', () => {
      const cards = fixture.debugElement.queryAll(By.css('.card'));
      expect(cards.length).toBeGreaterThanOrEqual(3); // Movie, Price, Payment
      cards.forEach(card => {
        expect(card.nativeElement.classList.contains('card')).toBe(true);
      });
    });

    it('should have the confirm payment button configured to be fullWidth', () => {
      // The app-button inside payment method card should have [fullWidth]="true"
      const buttonComponent = fixture.debugElement.query(By.css('app-button'));
      expect(buttonComponent).toBeTruthy();
      // Checking component instance input
      expect(buttonComponent.componentInstance.fullWidth()).toBe(true);
    });
  });

  describe('Interaction', () => {
    it('should call onConfirmPayment when the confirm button is clicked', () => {
      const spy = vi.spyOn(component, 'onConfirmPayment');
      
      const confirmButton = fixture.debugElement.query(By.css('app-button'));
      confirmButton.triggerEventHandler('btnClick', null);
      
      expect(spy).toHaveBeenCalled();
    });
  });
});

