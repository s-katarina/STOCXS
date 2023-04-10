import { Component, OnInit, ElementRef, ViewChild, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
import { HttpClient } from '@angular/common/http';
import { MatTabChangeEvent } from '@angular/material/tabs';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit, AfterViewInit {

  private apiKey: string = "demo"
  private allStocksAddress: string = "https://www.alphavantage.co/query?function=LISTING_STATUS&apikey=demo";

  constructor(private http: HttpClient) {

    this.getAllStocks()
    this.getAllCryptos()

    this.filteredCurrencies = this.currencyCtrl.valueChanges.pipe(
      startWith(null),
      map((c: string | null) => (c ? this._filterCurr(c) : this.allCurrencies.slice())),
    );
    this.filteredStocks = this.stockCtrl.valueChanges.pipe(
      startWith(null),
      map((s: string | null) => (s ? this._filterStocks(s) : this.allStocks.slice())),
    );
    this.dayIntervalCtrl.setValue('60')
   }
   
  ngAfterViewInit(): void {
  }

   private getAllStocks() {
    this.http.get(this.allStocksAddress, {responseType: 'text'}).subscribe((res:any) => {
      let rows = res.split('\n')
      let i = 0
      for (let row of rows) {
        i += 1
        let columns = row.split(',')
        if (i%17 == 0) this.allStocks.push(columns[1])
        this.stocksSymbolMap.set(columns[1], columns[0])
      }
      this.filteredStocks = this.stockCtrl.valueChanges.pipe(
        startWith(null),
        map((s: string | null) => (s ? this._filterStocks(s) : this.allStocks.slice())),
      );
    })
  }

  private getAllCryptos() {
    this.http.get("./assets/digital_currency_list.csv", {responseType: 'text'}).subscribe((res:any) => {
      let rows: string[] = res.split('\n')
      for (let i = 1; i < rows.length ; ++i ) {
        let columns = rows[i].split(',')
        if (columns.length > 1) {
          let c = columns[1].trim()
          this.allCurrencies.push(c)
          this.currencySymbolMap.set(c, columns[0])
        }
      }
      this.filteredCurrencies = this.currencyCtrl.valueChanges.pipe(
        startWith(null),
        map((s: string | null) => (s ? this._filterCurr(s) : this.allCurrencies.slice())),
      );
    })

  }

  // TABS
  
  @ViewChild('tabGroup') tabGroup: any;
  @Output() selectedTabChange: EventEmitter<MatTabChangeEvent> | undefined
  
  tabChanged(): void {
    if (this.selectedTimeToggleVal === 'day' && this.tabGroup.selectedIndex === 0) this.panelOpenCondition = false
    else if (this.selectedTimeToggleVal === 'day' && this.tabGroup.selectedIndex === 1) this.panelOpenCondition = true
  }

  // TIME TOGGLE BUTTONS WITH PANEL

  panelOpenCondition = false
  selectedTimeToggleVal: string = '';

  ngOnInit(): void {
    this.selectedTimeToggleVal = 'month'
  }

  public onTimeToggleValChange(val: string) {
    this.selectedTimeToggleVal = val;
    if (this.selectedTimeToggleVal == 'day' && this.tabGroup.selectedIndex === 1) this.panelOpenCondition = true
    else this.panelOpenCondition = false
  }

  // DAY INTERVAL RADIO BUTTONS
  dayIntervalCtrl = new FormControl();


// CHIPS 

  separatorKeysCodes: number[] = [ENTER, COMMA];

  currencyCtrl = new FormControl('');
  filteredCurrencies: Observable<string[]>;
  selectedCurrencies: string[] = ['Bitcoin', 'Ethereum']
  allCurrencies: string[] = []
  currencySymbolMap: Map<string, string> = new Map<string, string>()

  stockCtrl = new FormControl('');
  filteredStocks: Observable<string[]>;
  selectedStocks: string[] = ['AECOM', 'Team Inc']
  allStocks: string[] = []
  stocksSymbolMap: Map<string, string> = new Map<string, string>()

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

  public onViewDataClick() {

    let apiPaths: string[] = []
    
    if (this.tabGroup.selectedIndex === 0) {
      for (let c of this.selectedCurrencies) {
        let sym = this.currencySymbolMap.get(c)
        if (sym != undefined) apiPaths.push(this.buildApiPath(true, sym))
      }
    }
    else {
      for (let s of this.selectedStocks) {
        let sym = this.stocksSymbolMap.get(s)
        if (sym != undefined) apiPaths.push(this.buildApiPath(false, sym))
      }
    }

    for (let p of apiPaths) {
      console.log(p)
    }


  }

  private buildApiPath(isCrypto: boolean, symbol: string) {
    let basePath = 'https://www.alphavantage.co/query?function='
    let func = 'TIME_SERIES'
    if (isCrypto === true) func = 'DIGITAL_CURRENCY'
    let timeFrame = ''
    let market = 'CNY'
    let interv = ''
    
    switch(this.selectedTimeToggleVal) {
      case 'month':
        timeFrame = 'MONTHLY'
        break
      case 'week':
        timeFrame = 'WEEKLY'
        break
      case 'day':
        if (isCrypto === true) timeFrame = 'DAILY'
        else {
          timeFrame = 'INTRADAY'
          interv = '&interval=' + this.dayIntervalCtrl.value + 'min'
        }
        break
    }

    return basePath+func+'_'+timeFrame+'&symbol='+symbol+interv+'&market='+market+'&apikey='+this.apiKey
  }


}
