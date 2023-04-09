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
    this.filteredFruits = this.fruitCtrl.valueChanges.pipe(
      startWith(null),
      map((fruit: string | null) => (fruit ? this._filter(fruit) : this.allFruits.slice())),
    );
   }

  selectedItems = new FormControl('')
  cbItemsList: string[] = ['a', 'b', 'c']
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
  fruitCtrl = new FormControl('');
  filteredFruits: Observable<string[]>;
  fruits: string[] = ['Lemon'];
  allFruits: string[] = ['Apple', 'Lemon', 'Lime', 'Orange', 'Strawberry', 'sdf', 'sdfsdf', 'sdfsdfdsdddddddddddddddddddddddddd', 'sdfdsfsdfdfsdfd', 'dsfsdferw'];

  @ViewChild('fruitInput') fruitInput: ElementRef<HTMLInputElement> | undefined;

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      this.fruits.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();

    this.fruitCtrl.setValue(null);
  }

  remove(fruit: string): void {
    const index = this.fruits.indexOf(fruit);

    if (index >= 0) {
      this.fruits.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.fruits.push(event.option.viewValue);
    if (this.fruitInput != undefined) this.fruitInput.nativeElement.value = '';
    this.fruitCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allFruits.filter(fruit => fruit.toLowerCase().includes(filterValue));
  }


}
