/// <reference path="../../typings.d.ts" />

import {Component, Injectable, bind, OnInit} from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import {DateData} from '../pojo/date-data';
import {UserInputData} from '../pojo/user-input-data';
import {TariffData} from '../pojo/tariff-data';
import {RulesData} from '../pojo/rules-data';
import {RatePostData} from '../pojo/post-data';
import {YBIExistingTariffResponse} from '../pojo/ybi-tariff-response';
import {Subject, BehaviorSubject, Observable} from 'rxjs/Rx';
import {RateCalcService} from './rate-calc.service';
import {TestVectors} from './test-vector.service';

declare var $: JQueryStatic;

@Injectable()
export class TestDataGeneratorService {

    public static generateBaseTestingData(suiteNumber: number): RatePostData {
        switch (suiteNumber) {
            case 1:
                return {
                    user_input: {
                        guests: {
                            adults: 1,
                            children: 0
                        },
                        arrival: [2017, 8, 18],
                        departure: [2017, 9, 10]
                    },
                    tariff: {
                        "child_above": 0,
                        "guest_above": 0,
                        "base_nightly": 0,
                        "guest_max": 10,
                        "guest_min": 1,
                        "child_surcharge": 0,
                        "cpd": 0,
                        "booking_fee": 0,
                        "exec": 0,
                        "bond": 0,
                        "cpb": 0,
                        "cds": 0,
                        "guest_surcharge": 0,
                        "test_scheme_override": {
                            "groups": []
                        },
                        "test_seasons_override": {
                        }
                    }
                };
            case 2:
            case 3:
            case 4:
            default:
        }
        return null;
    }

    private deepFindProp(obj: Object, path: string) {
        for (let i = 0, pathArray = path.split('.'), len = pathArray.length; i < len; i++) {
            if (i < len -1 && !obj[pathArray[i]]) {
                console.warn(`=== Error: cannot find property ${pathArray[i]} in object ${JSON.stringify(obj)}`);
                return null;
            }
            obj = obj[pathArray[i]];
        };
        return obj;
    }

    private deepWriteProp(obj: Object, path: string, val: any) {
        let pathArray= path.split('.');
       for (let i = 0, len = pathArray.length; i < len - 1; i++) {
            let prop = pathArray[i];
            if (!obj[prop]) {
                obj[prop] = {};
            }
            obj = obj[prop];
        };
        obj[pathArray[pathArray.length-1]] = val;
        return obj;
    }

    private recurFindWildcards(o: Object, path: string): string[] {
        var result: string[] = [];
        for (let prop in path?this.deepFindProp(o, path):o) {
            let current_path = `${path?(path+'.'+prop):prop}`;
            let val = this.deepFindProp(o, current_path);
            if (typeof val == 'object') {
                result = result.concat(this.recurFindWildcards(o, current_path));
            } else if (val == '*ALL*') {
                // console.log(`Found: ${current_path}`);
                result.push(current_path);
            }
        }
        return result;
    }

    private recurGetAllCombs(def: Object): Object[] {
        if (Object.keys(def).length == 0) {
            return [];
        }

        let allKeys = Object.keys(def);

         let name = allKeys.pop();
         let values = def[name];

        if (allKeys.length == 0) {
            return values.map((val) => {
                let result = {};
                result[name] = val;
                return result;
            })
        } else {
            let newDef = {};
            allKeys.map((k) => {
                newDef[k] = def[k];
            })
            let resultArray = [];
            values.map((val) => {
                this.recurGetAllCombs(newDef).map((obj) => {
                    let newObj = {};
                    Object.keys(obj).map((k) => {
                        newObj[k] = obj[k];
                    });
                    newObj[name] = val;
                    resultArray.push(newObj);
                })
            });
            return resultArray;
        }
    }

    expandWildcards(base: Object): string[] {
        return this.recurFindWildcards(base, null);
    }

    generateTestingData(base: RatePostData, change: RatePostData): RatePostData {
        return $.extend(true, base, change);
    }

    createTestSquence(postArray: RatePostData[]): Observable<YBIExistingTariffResponse> {
        // return Observable.from(postArray).flatMap((postData: RatePostData) => 
        // this.http.post("http://app01.yesbookit.com/cgi-bin/test-tariff.pl", JSON.stringify(postData)).map((res: Response) => <YBIExistingTariffResponse>res.json()));
        // return Observable.concat(postArray.map((postData: RatePostData) =>
        //      this.http.post("http://app01.yesbookit.com/cgi-bin/test-tariff.pl", JSON.stringify(postData)).map((res: Response) => <YBIExistingTariffResponse>res.json())
        //     ));
        let httpReses: Observable<YBIExistingTariffResponse>[] = postArray.map((postData) =>
            this.http.post("http://app01.yesbookit.com/cgi-bin/test-tariff.pl", JSON.stringify(postData)).map((res: Response) => <YBIExistingTariffResponse>res.json())
        )

        return Observable.concat(...httpReses);
    }

    generateAllTestingDataWithSpec(base: RatePostData, change: any, spec: Object): RatePostData[] {
        let wildcards = this.expandWildcards(change);
        let spec_to_use = {};
        wildcards.forEach((s) => {
            spec_to_use[s] = this.deepFindProp(spec, s);
            // this.deepWriteProp(change, s, this.deepFindProp(spec, s));
        });

        return this.recurGetAllCombs(spec_to_use).map((o) => {
            let changeCopy = $.extend(true, {}, change);
            Object.keys(o).forEach((k) => {
                this.deepWriteProp(changeCopy, k, o[k]);
            });

            let baseCopy = $.extend(true, {}, base);
            return $.extend(true, baseCopy, changeCopy);
        });
    }

    constructor(public http: Http) {
        
        // For debugging purpose only
        // let change = {
        //     user_input: {
        //         guests: {
        //             adults: "*ALL*",
        //             children: 0
        //         }
        //     },
        //     tariff: {
        //         base_nightly: "*ALL*"
        //     }
        // };

        // let props_with_wildcards = this.expandWildcards(change);

        // console.log(props_with_wildcards);

        // let all_test_data = this.generateAllTestingDataWithSpec({tariff: {booking_fee: 35}}, change, TestVectors.defaultTestSpecs);

        // console.log(all_test_data);
    }
}

export var testDataGeneratorServiceInjectable: Array<any> = [
    bind(TestDataGeneratorService).toClass(TestDataGeneratorService)
];