/// <reference path="../../typings.d.ts" />

import {Component, Injectable, bind, OnInit} from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import {DateData} from '../pojo/date-data';
import {UserInputData} from '../pojo/user-input-data';
import {GuestData} from '../pojo/guest-data';
import {TariffData} from '../pojo/tariff-data';
import {RulesData} from '../pojo/rules-data';
import {RatePostData} from '../pojo/post-data';
import {YBIExistingTariffResponse, YBIExistingTariffResponseResult} from '../pojo/ybi-tariff-response';
import {Subject, BehaviorSubject, Observable} from 'rxjs/Rx';
import {RateCalcService} from './rate-calc.service';
import {TestVectors} from './test-vector.service';
import {TestDataRow} from '../pojo/test-plan';

declare var $: JQueryStatic;

@Injectable()
export class TestDataGeneratorService {

    public static defaultPostData: RatePostData = {
        user_input: {
            guests: {
                adults: 2,
                children: 2
            },
            arrival: [2017, 8, 18],
            departure: [2017, 9, 10]
        },
        tariff: {
            "child_above": 0,
            "guest_above": 2,
            "base_nightly": 125,
            "guest_max": 10,
            "guest_min": 1,
            "child_surcharge": 7,
            "cpd": 3,
            "booking_fee": 800,
            "exec": 0,
            "bond": 500,
            "cpb": 15,
            "cds": 3,
            "guest_surcharge": 11,
            "group1_rate_type": "F",
            "group1_perrata_type": "PN",
            "group1_nightly": 5,
            "group1_optional_weekly": 500.00,
            "test_scheme_override": {
                "tax": 1.0,
                "groups": []
            },
            "test_seasons_override": {
                "1": {
                    "name": "Blue Season",
                    "pairs": [
                    ]
                },
                "2": {
                    "name": "Orange Season",
                    "pairs": [
                    ]
                }
            }
        },
        rules: {
        }
    };

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

        // return Observable.from(postArray).flatMap((postData) =>
        //     this.http.post("http://app01.yesbookit.com/cgi-bin/test-tariff.pl", JSON.stringify(postData))).map((res: Response) => <YBIExistingTariffResponse>res.json());

        // concat solution
        let httpReses: Observable<YBIExistingTariffResponse>[] = postArray.map((postData) =>
            this.http.post("http://app01.yesbookit.com/cgi-bin/test-tariff.pl", JSON.stringify(postData)).map((res: Response) => <YBIExistingTariffResponse>res.json())
            // .do((r) => {
            //     console.log("--- http response ---");
            //     console.log(r);
            // })
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

    public static ybiRowDataConverter(row: TestDataRow): TestDataRow { 
        let symbol2text = {
            price_factor: {
                V: "Price",
                F: "Factor"
            },
            seasonProRata: {
                PW: "Optional Weekly÷7",
                PN: "Use Nightly Rate"
            },
            conditionTypes: {
                L: "Less than",
                M: "More than",
                E: "Equal to",
                B: "Block",
                b: "Block Per Rata",
                E5: "5 Day Stay",
                D: "DoW"
            },
            actionTypes: {
                A: "Add Sum",
                F: "Apply Factor",
                P: "Force Price"
            }
        };

        let map = {
            season1PriceType: symbol2text.price_factor,
            season2PriceType: symbol2text.price_factor,
            season1ProRataUse: symbol2text.seasonProRata,
            season2ProRataUse: symbol2text.seasonProRata,
            season1Rule1ConditionName: symbol2text.conditionTypes,
            season1Rule1ActionName: symbol2text.actionTypes
        };

        let new_row = $.extend(true, {}, row);

        Object.keys(map).forEach(k => {
            let t = map[k];
            if (row[k] && t[row[k]]) {
                new_row[k] = t[row[k]];
            }
        });

        return new_row;
    }

    public static ybiTestResultEvaluation(row: TestDataRow, success: () => {}, failure: () => {}): any {
        if (row.total == row.total2 && row.cleaning == row.cleaning2) {
            return success();
        } else {
            return failure();
        }
    }

    ybiResponseToTableRow(res: YBIExistingTariffResponse): TestDataRow {
        let row: TestDataRow = {};

        if (res.post_data) {
                    let user_input: UserInputData = <UserInputData>res.post_data.user_input;

                    if (user_input) {
                        row.arrival = user_input.arrival.join("/");
                        row.departure = user_input.departure.join("/");

                        let arrival = moment(row.arrival, "yyyy/MM/DD");
                        let departure = moment(row.departure, "yyyy/MM/DD");
                        let duration = (departure.diff(arrival))/86400000;
                        row.los = duration;

                        let guests: GuestData = <GuestData>user_input.guests;

                        if (guests) {
                            row.adults = guests.adults;
                            row.children = guests.children;
                        }
                    }

                    if (res.post_data.tariff)  {
                        let tariff: TariffData = res.post_data.tariff;
                        row.basePrice = tariff.base_nightly;
                        row.bookingFee = tariff.booking_fee;
                        row.cleaningBase = tariff.cpb;
                        row.cleaningPricePerBlock = tariff.cpd;
                        row.cleaningDayBlock = tariff.cds;
                        row.adultsAbove = tariff.guest_above;
                        row.adultsSurchargeAbove = tariff.guest_surcharge;
                        row.childrenAbove = tariff.child_above;
                        row.childrenSurchargeAbove = tariff.child_surcharge;

                        row.season1PriceType = tariff.group1_rate_type;
                        row.season1PriceOrFactor = tariff.group1_nightly;
                        row.season1OptionalWeekly = tariff.group1_optional_weekly;
                        row.season1ProRataUse = tariff.group1_perrata_type;

                        row.season2PriceType = tariff.group2_rate_type;
                        row.season2PriceOrFactor = tariff.group2_nightly;
                        row.season2OptionalWeekly = tariff.group2_optional_weekly;
                        row.season2ProRataUse = tariff.group2_perrata_type;

                        if (tariff.test_scheme_override && tariff.test_scheme_override.tax) {
                            row.tax = tariff.test_scheme_override.tax;
                        }

                        if (tariff.test_seasons_override && tariff.test_seasons_override[1]) {
                            if (tariff.test_seasons_override[1].pairs.length > 0) {
                                row.season1name = tariff.test_seasons_override[1].name;
                                row.season1P1Start = tariff.test_seasons_override[1].pairs[0].from;
                                row.season1P1End = tariff.test_seasons_override[1].pairs[0].to;
                                if (tariff.test_seasons_override[1].pairs.length > 1) {
                                    row.season1P2Start = tariff.test_seasons_override[1].pairs[1].from;
                                    row.season1P2End = tariff.test_seasons_override[1].pairs[1].to;
                                }
                            }
                        }

                        if (tariff.test_seasons_override && tariff.test_seasons_override[2]) {
                            if (tariff.test_seasons_override[2].pairs.length > 0) {
                                row.season2name = tariff.test_seasons_override[2].name;
                                row.season2P1Start = tariff.test_seasons_override[2].pairs[0].from;
                                row.season2P1End = tariff.test_seasons_override[2].pairs[0].to;
                            }
                        }
                    }

                    if (res.post_data.rules) {
                        let rules: RulesData = res.post_data.rules;
                        row.season1Rule1Name = rules.group1_adaysid_item1;
                        row.season1Rule1ConditionName = rules.group1_adaysm_item1;
                        row.season1Rule1ConditionValue = rules.group1_adaysn_item1;
                        row.season1Rule1ActionName = rules.group1_adaysc_item1;
                        row.season1Rule1ActionValue = rules.group1_adaysv_item1;

                        row.season1Rule2Name = rules.group1_adaysid_item2;
                        row.season1Rule2ConditionName = rules.group1_adaysm_item2;
                        row.season1Rule2ConditionValue = rules.group1_adaysn_item2;
                        row.season1Rule2ActionName = rules.group1_adaysc_item2;
                        row.season1Rule2ActionValue = rules.group1_adaysv_item2;

                        row.season2Rule1Name = rules.group2_adaysid_item1;
                        row.season2Rule1ConditionName = rules.group2_adaysm_item1;
                        row.season2Rule1ConditionValue = rules.group2_adaysn_item1;
                        row.season2Rule1ActionName = rules.group2_adaysc_item1;
                        row.season2Rule1ActionValue = rules.group2_adaysv_item1;

                        row.season2Rule2Name = rules.group2_adaysid_item2;
                        row.season2Rule2ConditionName = rules.group2_adaysm_item2;
                        row.season2Rule2ConditionValue = rules.group2_adaysn_item2;
                        row.season2Rule2ActionName = rules.group2_adaysc_item2;
                        row.season2Rule2ActionValue = rules.group2_adaysv_item2;                        
                    }
        }

        if (res.result && res.result.length > 0) {
            row.total = res.result[0].total;
            row.cleaning = res.result[0].clean;
            row.guestFee = res.result[0].gs;
            row.rent = res.result[0].xgs;
            row.resultBookingFee1 = res.result[0].Bfee;
            row.bondFee = res.result[0].bond;
            row.desc = res.result[0].desc;
        }

        if (res.result2 && res.result2.length > 0) {
            row.total2 = res.result2[0].total;
            row.cleaning2 = res.result2[0].clean;
            row.guestFee2 = res.result2[0].gs;
            row.rent2 = res.result2[0].xgs;
            row.resultBookingFee2 = res.result2[0].Bfee;
            row.bondFee2 = res.result2[0].bond;
            row.desc2 = res.result2[0].desc;
        }

        // console.log(row);
        return row;
    }

    public static ybiTableRowToResponse(row: TestDataRow): YBIExistingTariffResponse {

        let postData: RatePostData = TestDataGeneratorService.defaultPostData;

        postData.user_input = {
                    guests: {
                        adults: row.adults,
                        children: row.children
                    },
                    arrival: row.arrival.split("/").map(n => parseInt(n)),
                    departure: row.departure.split("/").map(n => parseInt(n))
                };

        postData.tariff.base_nightly = row.basePrice;
        postData.tariff.booking_fee = row.bookingFee;
        postData.tariff.cds = row.cleaningDayBlock;
        postData.tariff.cpd = row.cleaningPricePerBlock;
        postData.tariff.cpb = row.cleaningBase;
        postData.tariff.guest_above = row.adultsAbove;
        postData.tariff.child_above = row.childrenAbove;
        postData.tariff.guest_surcharge = row.adultsSurchargeAbove;
        postData.tariff.child_surcharge = row.childrenSurchargeAbove;
        postData.tariff.test_scheme_override.tax = row.tax;
        postData.tariff.bond = row.bondFee;

        postData.tariff.group1_rate_type = row.season1PriceType;
        postData.tariff.group2_rate_type = row.season2PriceType;
        postData.tariff.group1_nightly = row.season1PriceOrFactor;
        postData.tariff.group2_nightly = row.season2PriceOrFactor;
        postData.tariff.group1_optional_weekly = row.season1OptionalWeekly;
        postData.tariff.group2_optional_weekly = row.season2OptionalWeekly;
        postData.tariff.group1_perrata_type = row.season1ProRataUse;
        postData.tariff.group2_perrata_type = row.season2ProRataUse;

        if (row.season1P1Start) {
            postData.tariff.test_scheme_override.groups = [1];
            postData.tariff.test_seasons_override[1] = {};
            postData.tariff.test_seasons_override[1] .name = row.season1name;
            postData.tariff.test_seasons_override[1].pairs = [{
                from: row.season1P1Start,
                to: row.season1P1End
            }];
        }

        if (row.season1P2Start) {
            postData.tariff.test_seasons_override[1].pairs.push({
                from: row.season1P2Start,
                to: row.season1P2End
            });
        }

        if (row.season2P1Start) {
            postData.tariff.test_scheme_override.groups = [1,2];
            postData.tariff.test_seasons_override[2] = {};
            postData.tariff.test_seasons_override[2].name = row.season2name;
            postData.tariff.test_seasons_override[2].pairs = [{
                from: row.season2P1Start,
                to: row.season2P1End
            }];
        }

        postData.rules.group1_adaysid_item1 = row.season1Rule1Name;
        postData.rules.group1_adaysm_item1 = row.season1Rule1ConditionName;
        postData.rules.group1_adaysn_item1 = row.season1Rule1ConditionValue;
        postData.rules.group1_adaysc_item1 = row.season1Rule1ActionName;
        postData.rules.group1_adaysv_item1 = row.season1Rule1ActionValue;

        postData.rules.group1_adaysid_item2 = row.season1Rule2Name;
        postData.rules.group1_adaysm_item2 = row.season1Rule2ConditionName;
        postData.rules.group1_adaysn_item2 = row.season1Rule2ConditionValue;
        postData.rules.group1_adaysc_item2 = row.season1Rule2ActionName;
        postData.rules.group1_adaysv_item2 = row.season1Rule2ActionValue;

        postData.rules.group2_adaysid_item1 = row.season2Rule1Name;
        postData.rules.group2_adaysm_item1 = row.season2Rule1ConditionName;
        postData.rules.group2_adaysn_item1 = row.season2Rule1ConditionValue;
        postData.rules.group2_adaysc_item1 = row.season2Rule1ActionName;
        postData.rules.group2_adaysv_item1 = row.season2Rule1ActionValue;

        postData.rules.group2_adaysid_item2 = row.season2Rule2Name;
        postData.rules.group2_adaysm_item2 = row.season2Rule2ConditionName;
        postData.rules.group2_adaysn_item2 = row.season2Rule2ConditionValue;
        postData.rules.group2_adaysc_item2 = row.season2Rule2ActionName;
        postData.rules.group2_adaysv_item2 = row.season2Rule2ActionValue;

        let result: YBIExistingTariffResponseResult = {};
        result.total = row.total;
        result.xgs = row.rent;
        result.desc = row.desc;
        result.clean = row.cleaning;
        result.gs = row.guestFee;
        result.Bfee = row.resultBookingFee1;
        result.bond = row.bondFee;

        let result2: YBIExistingTariffResponseResult = {};
        result2.total = row.total2;
        result2.xgs = row.rent2;
        result2.desc = row.desc2;
        result2.clean = row.cleaning2;
        result2.gs = row.guestFee2;
        result2.Bfee = row.resultBookingFee2;
        result2.bond = row.bondFee2;

        let res: YBIExistingTariffResponse = {
            result: [result],
            result2: [result],
            tariff_file: "xxxx",
            post_data: postData
        };

        return res;
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