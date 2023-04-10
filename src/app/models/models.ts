import { MatTableDataSource } from "@angular/material/table"

export interface Cripto {
    open: String
    high: String
    low: String
    close: String
    volume: String
    date: String
}

export interface TableData {
    name: String
    data: Cripto[]
    length: number
    currentPage: number
    pageSize: number
    dataSource: MatTableDataSource<Cripto>
}

export interface Tables {
    tables: TableData[]
}

export interface GraphData {
    xData: Array<any>
    yData: Array<any>
    name: string
}