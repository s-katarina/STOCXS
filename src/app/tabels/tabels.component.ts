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
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = new MatTableDataSource<TableData>(this.tables.tables);
  public currentPage = 0;
  public pageSize:number = 50;
  public length:number = 0;

  ngOnInit(): void {
    this.tryAddingData()
    this.dataSource.paginator = this.paginator;
  }

  tryAddingData(): void {
    this.tables.tables.push({name: "probica", data:[]})
    this.testGettingData("https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&symbol=IBM&apikey=");

  }

  private testGettingData(adress:string) {
    this.getData(adress).subscribe(
      (res: any) => {
        console.log(res);
        let name: string = res["Meta Data"]["2. Symbol"] + "";
        console.log(name);
        let data = [];
        for (let row in res["Monthly Time Series"]) {
          let apiReturnValue = res["Monthly Time Series"][row + ""];
          let cripro: Cripto = {
            open: apiReturnValue["1. open"],
            high: apiReturnValue["2. high"],
            low: apiReturnValue["3. low"],
            close: apiReturnValue["4. close"],
            volume: apiReturnValue["5. volume"],
            date: row + ""
          };
          data.push(cripro);
        }

        this.tables.tables.push({ name: name, data: data });
        console.log(this.tables);
        this.length = data.length;
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

  public handlePage(event?:any) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    // this.pageIteration();
  }

  // private pageIteration() {
  //   const end = (this.currentPage + 1) * this.pageSize;
  //   const start = this.currentPage * this.pageSize;
  //   const part = this.rides.slice(start, end);
  //   this.dataSource = new MatTableDataSource<Ride>(part);
  // }

}
