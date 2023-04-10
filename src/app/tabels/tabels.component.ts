import { Component, Injectable, OnInit, ViewChild } from '@angular/core';
import { Cripto, TableData, Tables } from 'app/models/models';
import {ViewEncapsulation} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-tabels',
  templateUrl: './tabels.component.html',
  styleUrls: ['./tabels.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class TabelsComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private http: HttpClient) { }
  
  tables: Tables = {
    tables: []
  }
  displayedColumns: string[] = ['date', 'open', 'close', 'low', 'high'];


  ngOnInit(): void {
    this.tryAddingData()
  }

  tryAddingData(): void {
    this.tables.tables.push({
      name: "probica", data: [],
      length: 0,
      currentPage: 0,
      pageSize: 0,
      dataSource: new MatTableDataSource<Cripto>()
    })
    this.testGettingData("https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&symbol=IBM&apikey=");
    this.testGettingData("https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY&symbol=BAC&apikey=");
  }

  private testGettingData(adress:string) {
    this.getData(adress).subscribe(
      (res: any) => {
        console.log(res);
        let name: string = res["Meta Data"]["2. Symbol"] + "";
        console.log(name);
        let data = [];
        let keyForData:string = ''
        for (let key in res){
          if (key.includes('Time Series')) keyForData = key
        }
        console.log(keyForData)
        for (let row in res[keyForData]) {
          let apiReturnValue = res[keyForData][row];
          let cripro: Cripto = {
            open: Number(apiReturnValue["1. open"]).toFixed(2),
            high: Number(apiReturnValue["2. high"]).toFixed(2),
            low: Number(apiReturnValue["3. low"]).toFixed(2),
            close: Number(apiReturnValue["4. close"]).toFixed(2),
            volume: apiReturnValue["5. volume"],
            date: row + ""
          };
          data.push(cripro);
        }

        const newTable = {
          name: name, 
          data: data,
          length: data.length,
          currentPage: 0,
          pageSize: 10,
          dataSource: new MatTableDataSource<Cripto>(data)
        };
        newTable.dataSource.paginator = this.paginator
        this.tables.tables.push(newTable);
        console.log(this.tables);
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  public getData(address: string): Observable<any> {
    return this.http.get(address);
    // return new Observable<1>;
  }

  public handlePage(table:TableData, event?:any) {
    table.currentPage = event.pageIndex;
    table.pageSize = event.pageSize;
    this.pageIteration(table);
  }

  private pageIteration(table:TableData) {
    const end = (table.currentPage + 1) * table.pageSize;
    const start = table.currentPage * table.pageSize;
    const part = table.data.slice(start, end);
    table.dataSource = new MatTableDataSource<Cripto>(part);
  }

}
