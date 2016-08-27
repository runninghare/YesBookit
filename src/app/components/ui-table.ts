
import {Component, Input, ViewChild, ElementRef, OnInit} from '@angular/core';

import {Subject, BehaviorSubject, Observable} from 'rxjs/Rx';

declare var $: JQueryStatic;

export interface UiTableConfig {
    name: string;
    title: string;
    content?: string;
    sort?: boolean;
    class?: string;
}

export class UITableAction {
	applyRowClasses(row: any): string {
		return null;
	}

	clickRow(row: any): void {
	}
}

export interface UiTableOptions {
	itemsPerPage?: number;
}

interface OrderType {
	name: string;
	order: number;
}

@Component({
    selector: 'ui-table',
    template: `
<table class="ui very compact celled table">
  <thead>
    <tr class="ui content form">
      <th *ngFor="let c of tableConfig" class="field">
      		<a href="" (click)="toggleOrder(c.name)">{{c.title}}</a>
		<div class="ui labeled input">
			<input [name]="c.name" [(ngModel)]="filter[c.name]" (ngModelChange)="filterUpdate($event)" style="width: 50px" placeholder="Search" type="text">
		</div>
      	</th>
    </tr>
  </thead>
  <tbody>
    <tr 	*ngFor="let row of pagedData$ | async" 
          	[class]="tableActions.applyRowClasses(row)" 
          	(click)="tableActions.clickRow(row)"
          >
        <td *ngFor="let k of getKeys(row); let i = index">
        <div [innerHtml]="tableConfig[i].content || row[k]"></div>
        </td>
    </tr>
  </tbody>
</table>   
<div class="ui grid" *ngIf="pageTotal > 1">
  	<div class="four column row">
  	<div class="left floated column">Items {{indexBegin+1}} - {{indexEnd}} / {{itemsTotal}} </div>
  	<div class="right floated column">
  		  <a href="" (click)="setCurrentPage(currentPage-1)" class="icon item">
	          <i class="left chevron icon"></i>
	        </a>
	        Page 
	        <input [(ngModel)]="currentPage" (ngModelChange)="setCurrentPage(currentPage)" style="width: 40px" type="number" />
	         of {{pageTotal}}
	        <a href="" (click)="setCurrentPage(currentPage+1)" class="icon item">
	          <i class="right chevron icon"></i>
	        </a>
  	</div>
       <!-- <div class="ui right floated pagination menu">
	        <a (click)="setCurrentPage(currentPage-1)" class="icon item">
	          <i class="left chevron icon"></i>
	        </a>
	        <a (click)="setCurrentPage(p)" class="item" *ngFor="let p of getPageSequence()">{{p}}</a>
	        <a (click)="setCurrentPage(currentPage+1)" class="icon item">
	          <i class="right chevron icon"></i>
	        </a>
       </div> -->
  </div> 
    `,
    inputs: ['tableConfig', 'tableActions', 'dataSource', 'tableOptions']
})
export class UiTable implements OnInit {

    tableConfig: UiTableConfig[];
    tableActions: any;
    tableOptions: UiTableOptions = {
    	itemsPerPage: 10
    }

    tableData: Object[];
    dataSource: Observable<Object[]>;

    filter: Object = {};
    filter$: Subject<Object> = new BehaviorSubject<Object>(null);
    filteredData$: Observable<Object[]>;

    orderBy: OrderType[] = [];
    orderBy$: Subject<Object[]> = new BehaviorSubject<Object[]>(null);
    orderedData$: Observable<Object[]>;

    pageTotal: number = 1;
    currentPage: number = 1;
    itemsTotal: number = 0;
    indexBegin: number = 0;
    indexEnd: number = 0;
    currentPage$: Subject<number> = new BehaviorSubject<number>(1);
    pagedData$: Observable<Object[]>;

    filterUpdate(val): void {
    	console.log(this.filter);
    	this.filter$.next(this.filter);
    }

    toggleOrder(name: string): boolean {
    	var index = this.orderBy.map((elem) => elem.name).indexOf(name);
    	if (index < 0) {
    		this.orderBy.unshift({
    			name: name,
    			order: -1
    		});
    	} else {
    		let oldOrder = this.orderBy.splice(index, 1);
    		oldOrder[0].order = -(oldOrder[0].order);
    		this.orderBy.unshift(oldOrder[0]);
    	}
    	this.orderBy$.next(this.orderBy);
    	return false;
    }

    getPageSequence(): number[] {
    	return Array.apply(null, Array(this.pageTotal)).map((e, i) => i+1);
    }

    setCurrentPage(p: number): boolean {
    	this.currentPage = Math.min(Math.max(p, 1), this.pageTotal);
    	this.currentPage$.next(this.currentPage);
    	return false;
    }

    ngOnInit(): void {

	this.filteredData$ = this.filter$.combineLatest(this.dataSource, (x: Object, y: Object[]) => {
		if (!x || typeof x != "object") return y;
		return Object.keys(x).reduce((result, key) => result.filter((val) => !x[key] || val[key].toLowerCase().indexOf(x[key].toLowerCase()) > -1), y);
	});

	this.orderedData$ = this.orderBy$.combineLatest(this.filteredData$, (x: Object[], y: Object[]) => {
		if (!x || x.length == 0) return y;
		return y.sort((a, b) => <number>x.reduce((result, elem:any)=>result || ((a[elem.name]<b[elem.name])?elem.order:(a[elem.name]>b[elem.name])?-(elem.order):0), 0));
		// return <Object[]>(x.reduce((pre: any[], elem) => pre.sort((a,b) => (a[elem.name] < b[elem.name])?elem.order:(a[elem.name] > b[elem.name])?-(elem.order):0), y));
	});

	this.pagedData$ = this.currentPage$.combineLatest(this.orderedData$, (x: number, y: Object[]) => {
		let itemPerPage = (this.tableOptions && this.tableOptions.itemsPerPage) || 10;
		let indexBegin = this.indexBegin = (x-1) * itemPerPage;
		let indexEnd = this.indexEnd = Math.min(itemPerPage + indexBegin, y.length);

		console.log(`x = ${x}, indexBegin = ${indexBegin}, length = ${length}`);

		return y.slice(indexBegin, indexEnd);
	});

	// ====== subscriptions =========

	this.filteredData$.subscribe((elem: Object[]) => {
		this.itemsTotal = elem.length;
		this.pageTotal = Math.ceil(elem.length / ((this.tableOptions && this.tableOptions.itemsPerPage) || 10));
		console.log(`Total Page = ${this.pageTotal}`);
	});

	// --- test ---

	// this.orderedData$.subscribe((o: Object) => {
	// 	console.log("=== ordered objects ===");
	// 	console.log(o);
	// });

	// this.orderBy$.subscribe((elem: OrderType[]) => console.log(elem));

	// this.orderBy = [{name:"status", order: -1}, {name: "name", order: -1}];
	// this.orderBy$.next(this.orderBy);

    }

    getKeys(obj: Object): any[] {
        return Object.keys(obj);
    }

    constructor() {
    }

}