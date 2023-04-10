import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GraphData } from 'app/models/models';
import * as CanvasJSAngularChart from '../../assets/canvasjs.angular.component';


@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnInit{

  graph?: CanvasJSAngularChart.CanvasJSChart
  chartOptions: any = {}

  interval: string = ""
  type: string = ""
  links: Array<string> = []

  @Input() subject: any 

  constructor(private http: HttpClient) { }

  // async ngOnChanges(changes: SimpleChanges): Promise<void> {
  //   console.log(changes)
  //   if (changes["interval"])
  //     this.interval = changes["interval"].currentValue
  //   if (changes["type"])
  //     this.type = changes["type"].currentValue
  //   if (changes["links"])
  //     this.links = changes["links"].currentValue
  //   await this.fun()
  // }

  async ngOnInit(): Promise<void> {
    this.subject.subscribe((res: any) => {
      this.interval = res["interval"]
      this.type = res["type"]
      this.links = res["links"]
    })
    this.fun()
  }

  async fun() {
    let arr: Array<GraphData> = []
    for (let link of this.links) {
      let res: any = await this.getDataFromAPI(link).toPromise()
      arr.push(this.parseAPIResponse(res, this.type))
    }
    this.fillGraph(arr, this.interval)
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
