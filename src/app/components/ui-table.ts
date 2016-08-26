
import {Component} from '@angular/core';

export interface UiTableConfig {
    name: string;
    title: string;
    content?: string;
    sort?: boolean;
    class?: string;
}

@Component({
    selector: 'ui-table',
    template: `
<table class="ui very compact celled table">
  <thead>
    <tr>
      <th *ngFor="let c of tableConfig">{{c.title}}</th>
    </tr>
  </thead>
  <tbody>
    <tr *ngFor="let row of tableData">
        <td *ngFor="let k of getKeys(row); let i = index">
        <div [innerHtml]="tableConfig[i].content || row[k]"></div>
        </td>
    </tr>
    <tr>
      <td>No Name Specified</td>
      <td>Unknown</td>
      <td class="negative">None</td>
    </tr>
    <tr class="positive">
      <td>Jimmy</td>
      <td><i class="icon checkmark"></i> Approved</td>
      <td>None</td>
    </tr>
    <tr>
      <td>Jamie</td>
      <td>Unknown</td>
      <td class="positive"><i class="icon close"></i> Requires call</td>
    </tr>
    <tr class="negative">
      <td>Jill</td>
      <td>Unknown</td>
      <td>None</td>
    </tr>
  </tbody>
  <tfoot>
    <tr><th colspan="3">
      <div class="ui right floated pagination menu">
        <a class="icon item">
          <i class="left chevron icon"></i>
        </a>
        <a class="item">1</a>
        <a class="item">2</a>
        <a class="item">3</a>
        <a class="item">4</a>
        <a class="icon item">
          <i class="right chevron icon"></i>
        </a>
      </div>
    </th>
  </tr></tfoot>
</table>    
    `
})
export class UiTable {

    tableConfig: UiTableConfig[] = [
        {
            name: "name",
            title: "Name",
        },
        {
            name: "status",
            title: "Status",
            content: '<b>{{row[k]}}</b>'
        },
        {
            name: "notes",
            title: "Notes"
        }
    ];

    tableData: Object[] = [
        {
            name: "John",
            status: "OK",
            notes: "Goal Keeper"
        },
        {
            name: "Messi",
            status: "OK",
            notes: "Center-Forward"
        },
        {
            name: "Lampard",
            status: "Great",
            notes: "Mid-Fielder"
        }
    ];

    getKeys(obj: Object): any[] {
        return Object.keys(obj);
    }

}