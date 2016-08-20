import  {Component, Injectable, Input, AfterViewInit, bind} from '@angular/core';
import {DateData} from '../pojo/date-data';
import {Subject, BehaviorSubject} from 'rxjs/Rx';

@Injectable()
export class DateDataService {
    currentDateData: Subject<DateData> = new BehaviorSubject<DateData>(null);

    public setCurrentDateData(dateData: DateData): void {
        this.currentDateData.next(dateData);
    }
}

export var dateDataServiceInjectable: Array<any> = [
  bind(DateDataService).toClass(DateDataService)
];