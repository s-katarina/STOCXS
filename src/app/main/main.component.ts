import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  constructor() {
    this.filteredCurrencies = this.currencyCtrl.valueChanges.pipe(
      startWith(null),
      map((c: string | null) => (c ? this._filterCurr(c) : this.allCurrencies.slice())),
    );
    this.filteredStocks = this.stockCtrl.valueChanges.pipe(
      startWith(null),
      map((s: string | null) => (s ? this._filterStocks(s) : this.allStocks.slice())),
    );
   }

  // TIME TOGGLE BUTTONS WITH PANEL

  panelOpenCondition = false
  selectedTimeToggleVal: string = '';

  ngOnInit(): void {
    this.selectedTimeToggleVal = 'month'
  }

  public onTimeToggleValChange(val: string) {
    this.selectedTimeToggleVal = val;
    if (this.selectedTimeToggleVal == 'day') this.panelOpenCondition = true
    else this.panelOpenCondition = false
  }


// CHIPS 
  separatorKeysCodes: number[] = [ENTER, COMMA];

  currencyCtrl = new FormControl('');
  filteredCurrencies: Observable<string[]>;
  selectedCurrencies: string[] = ['BTC']
  allCurrencies: string[] = ['BTC', 'ETHEREUM', 'DOGE COIN']

  stockCtrl = new FormControl('');
  filteredStocks: Observable<string[]>;
  selectedStocks: string[] = ['WAYSTAR']
  allStocks: string[] = ['HP', 'UNILEVER', 'WAYSTAR']

  @ViewChild('currencyInput') currencyInput: ElementRef<HTMLInputElement> | undefined;

  addCurrency(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value && !this.selectedCurrencies.includes(value) && this.allCurrencies.includes(value)) {
      this.selectedCurrencies.push(value);
    }

    event.chipInput!.clear();

    this.currencyCtrl.setValue(null);
  }

  removeCurrency(c: string): void {
    const index = this.selectedCurrencies.indexOf(c);

    if (index >= 0) {
      this.selectedCurrencies.splice(index, 1);
    }
  }

  selectedCurrency(event: MatAutocompleteSelectedEvent): void {
    if (!this.selectedCurrencies.includes(event.option.viewValue)) this.selectedCurrencies.push(event.option.viewValue);
    if (this.currencyInput != undefined) this.currencyInput.nativeElement.value = '';
    this.currencyCtrl.setValue(null);
  }

  @ViewChild('stockInput') stockInput: ElementRef<HTMLInputElement> | undefined;

  addStock(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value && !this.selectedStocks.includes(value) && this.allStocks.includes(value)) {
      this.selectedStocks.push(value);
    }

    event.chipInput!.clear();

    this.stockCtrl.setValue(null);
  }

  removeStock(s: string): void {
    const index = this.selectedStocks.indexOf(s);

    if (index >= 0) {
      this.selectedStocks.splice(index, 1);
    }
  }

  selectedStock(event: MatAutocompleteSelectedEvent): void {
    if (!this.selectedStocks.includes(event.option.viewValue)) this.selectedStocks.push(event.option.viewValue);
    if (this.stockInput != undefined) this.stockInput.nativeElement.value = '';
    this.stockCtrl.setValue(null);
  }

  private _filterCurr(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allCurrencies.filter(c => c.toLowerCase().includes(filterValue));
  }

  private _filterStocks(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allStocks.filter(c => c.toLowerCase().includes(filterValue));
  }


}
