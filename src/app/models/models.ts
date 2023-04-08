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
}

export interface Tables {
    tables: TableData[]
}