import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import {BehaviorSubject, Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
import { HttpClient } from '@angular/common/http';
import { tick } from '@angular/core/testing';
import * as CanvasJSAngularChart from '../../assets/canvasjs.angular.component';
import { GraphData } from 'app/models/models';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit, AfterViewInit {

  // private apiKey: string = "FQMG54Q117RDF93U"
  private apiKey: string = "X009DI1MYVSAXSKU"
  private allStocksAddress: string = "https://www.alphavantage.co/query?function=LISTING_STATUS&apikey=" + this.apiKey;

  public intervalProp: string = ""
  public typeProp: string = ""
  public linksProp: string[] = []

  sub = new BehaviorSubject({})

  graph?: CanvasJSAngularChart.CanvasJSChart
  chartOptions: any = {}

  interval: string = "monthly"
  type: string = "crypto"
  links: Array<string> = [
    "https://www.alphavantage.co/query?function=DIGITAL_CURRENCY_MONTHLY&symbol=BTC&market=CNY&apikey=X009DI1MYVSAXSKU",
    "https://www.alphavantage.co/query?function=DIGITAL_CURRENCY_MONTHLY&symbol=ETH&market=CNY&apikey=X009DI1MYVSAXSKU"
  ]

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
    // this.onViewDataClick()
    this.fun()
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

    let obj: any = {
      interval: "",
      type: "",
      links: new Array<string>()
    }

    this.links = apiPaths

    if (this.tabGroup.selectedIndex === 0)
      this.type = "crypto"
    else
      this.type = "stocks"

    if (this.selectedTimeToggleVal == "month")
      this.interval = "monthly"
    else if (this.selectedTimeToggleVal == "week")
      this.interval = "weekly"
    else if (this.selectedTimeToggleVal == "day" && this.typeProp == "crypto")
      this.interval = "daily"
    else
      this.interval = "intraday"

    this.fun()

    this.sub.next(obj)
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











  async fun() {
    let arr: Array<GraphData> = []
    for (let link of this.links) {
      let res: any = await this.getDataFromAPI(link).toPromise()
      arr.push(this.parseAPIResponse(res, this.type))
    }
    this.fillGraph(arr, this.interval)
    console.log("asd")
  }

  getDataFromAPI(address: string) {
    return this.http.get(address)
  }

  parseAPIResponse(data: any, type: string): GraphData {
    let name: string = ""
    if (type == "stocks")
      name = data["Meta Data"]["2. Symbol"]
    else
      name = data["Meta Data"]["3. Digital Currency Name"]
      
    let dataKey: string = ""
    for (const [key, value] of Object.entries(data))
      if (key.toLowerCase().includes("time series"))
        dataKey = key

    let XData: Array<any> = []
    let YData: Array<any> = []

    for (let key in data[dataKey]) {
      XData.push(key)
      let OHLCVals: Array<any> = []
      if (type == "stocks") {
        OHLCVals.push(data[dataKey][key]["1. open"])
        OHLCVals.push(data[dataKey][key]["2. high"])
        OHLCVals.push(data[dataKey][key]["3. low"])
        OHLCVals.push(data[dataKey][key]["4. close"])
      }
      else {
        OHLCVals.push(data[dataKey][key]["1b. open (USD)"])
        OHLCVals.push(data[dataKey][key]["2b. high (USD)"])
        OHLCVals.push(data[dataKey][key]["3b. low (USD)"])
        OHLCVals.push(data[dataKey][key]["4b. close (USD)"])
      }
      YData.push(OHLCVals)
    }
    let graphData: GraphData = {
      xData: XData,
      yData: YData,
      name: name
    }
    return graphData
  }

  fillGraph(data: Array<GraphData>, interval: string) {

    let format: string = ""
    if (interval == "monthly")
      format = "MMM"
    else if (interval == "weekly")
      format = "DD-MM-YY"
    else if (interval == "daily")
      format = "DD-MM-YY"
    else 
      format = "hh:mm TT"

    let title: string = ""
    for (let d of data)
      title += d.name + ", "
    title = title.substring(0, title.length - 2)

    let options: any = {
      animationEnabled: true,
      exportEnabled: true,
      zoomEnabled: true, 
      exportFileName: "saved file",	
      legend: {
        cursor: "pointer",
        itemclick: this.toogleDataSeries
      },
      theme: "dark1",
      // backgroundColor: "#f5f5f5",
      title: {
        text: title
      },
      axisX: {
        valueFormatString: format
      },
      axisY: {
        title: "Price in USD",
        prefix: "$"
      },
      data: []
    }

    for (let d of data) {
      let obj: any = {
        type: "ohlc",
        yValueFormatString: "$##.##",
        xValueFormatString: "MMM YYYY",
        showInLegend: true,
        legendText: d.name,
        dataPoints: []
      }

      for (let i = 0; i < d.xData.length; i++)
        obj.dataPoints.push({
          x: new Date(d.xData[i]),
          y: d.yData[i].map((el: string) => Number(el))
        })

      options.data.push(obj)
    }

    this.chartOptions = options
    console.log(this.chartOptions)

  }

  toogleDataSeries(e: any) {
    if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
      e.dataSeries.visible = false;
    } else {
      e.dataSeries.visible = true;
    }
    e.chart.render();
  }

  getDateFromString(str: string) {
    let tokens: Array<string> = str.split("-")
    return new Date(Number(tokens[0]), Number(tokens[1]), Number(tokens[2]))
  }


}
