import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  constructor() { }

  selectedItems = new FormControl('')
  cbItemsList: string[] = ['a', 'b', 'c']
  

  ngOnInit(): void {
  }

}
