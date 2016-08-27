import {Component, OnInit} from '@angular/core';
import {CORE_DIRECTIVES, NgClass, NgIf} from '@angular/common';
import {Subject, BehaviorSubject, Observable} from 'rxjs/Rx';
import {UiTableConfig, UiTable, UITableAction, UiTableOptions} from '../components/ui-table';

// webpack html imports

@Component({
  selector: 'my-spike',
  // templateUrl: "app/spike/table-demo.html",
  template: `
  <h1>My Spike</h1>
  <ui-table [tableConfig]="tableConfig" [tableActions]="tableActions" [dataSource]="dataSource$" [tableOptions]="tableOptions"></ui-table>
  `,
  directives: [UiTable]
})
export class MySpike {

	tableConfig: UiTableConfig[] = [
		{
			name: "name",
			title: "Name",
		},
		{
			name: "status",
			title: "Status",
		},
		{
			name: "notes",
			title: "Notes"
		}
	];

	dataSource$: Subject<Object[]> = new BehaviorSubject<Object[]>([
		{
			name: "John",
			status: "OK",
			notes: "Goal Keeper"
		},
		{
			name: "Messi",
			status: "Not Good",
			notes: "Center-Forward"
		},
		{
			name: "Lampard",
			status: "Great",
			notes: "Mid-Fielder"
		},
		{
			name: "Simon",
			status: "OK",
			notes: "Goal Keeper"
		},
		{
			name: "Fieldnand",
			status: "Great",
			notes: "Center-Forward"
		},
		{
			name: "Ronaldo",
			status: "Not Good",
			notes: "Mid-Fielder"
		},
		{
			name: "Baterz",
			status: "OK",
			notes: "Goal Keeper"
		},
		{
			name: "Klose",
			status: "Great",
			notes: "Center-Forward"
		},
		{
			name: "Robert",
			status: "Great",
			notes: "Mid-Fielder"
		},
		{
			name: "Bofoon",
			status: "OK",
			notes: "Goal Keeper"
		},
		{
			name: "Batistota",
			status: "Not Good",
			notes: "Center-Forward"
		},
		{
			name: "Beckham",
			status: "Great",
			notes: "Mid-Fielder"
		}
	]);
	
	tableActions: UITableAction;

	tableOptions: UiTableOptions = {
		itemsPerPage: 10
	};

	constructor() {
		class Action extends UITableAction {
			applyRowClasses(row: any): string {
				return 	row.status == "Not Good" ? "negative" :
						row.status == "Great" ? "positive" : null;
			}
			
			clickRow(row: any): void {
				console.log(row);
			}
		}

		this.tableActions = new Action();
	}
}