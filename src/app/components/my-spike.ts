import {Component, OnInit} from '@angular/core';
import {CORE_DIRECTIVES, NgClass, NgIf} from '@angular/common';
import {UiTable} from '../components/ui-table';

// webpack html imports

@Component({
  selector: 'my-spike',
  // templateUrl: "app/spike/table-demo.html",
  template: `
  <h1>My Spike</h1>
  <ui-table></ui-table>
  `,
  directives:[UiTable]
})
export class MySpike {
    constructor() {
    }
}