import  {Injectable} from '@angular/core';

@Injectable()
export class TestPlanItem {
    constructor(public title: string, public description: string, public numOfTests: number) {
    }
}