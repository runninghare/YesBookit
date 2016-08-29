import {Injectable, bind} from '@angular/core';
import {RatePostData} from '../pojo/post-data';
import {UiTableConfig, UiTable, UITableAction, UiTableOptions} from '../components/ui-table';
import {TestPlanItem, TestDataRow} from '../pojo/test-plan';
import {TestDataGeneratorService} from '../services/test-data-generator.service';
import {Observable, Subject, BehaviorSubject} from 'rxjs/Rx';
import {YBIExistingTariffResponseResult, YBIExistingTariffResponse} from '../pojo/ybi-tariff-response';
import {TestVectors} from './test-vector.service';

declare var $: JQueryStatic;

@Injectable()
export class TestPlanService {

	testPlan: TestPlanItem[] = [
		{
			name: "suite1",
			title: "Suite 1",
			description: "Property Tariff tests without seasonal settings",
			numOfTests: 5
		},
		{
			name: "suite2",
			title: "Suite 2",
			description: "Property Tariff + Single Season w/o rules & w/o crossover",
			numOfTests: 4
		},
		{
			name: "suite3",
			title: "Suite 3",
			description: "Property Tariff + Single Season with rules but w/o crossover",
			numOfTests: 84
		},
		{
			name: "suite4",
			title: "Suite 4",
			description: "Crossover Tests",
			numOfTests: 168
		}
	];

	basePostData: any = {
		no_season:  {
			user_input: {
				guests: {
					adults: 1,
					children: 0
				},
				arrival: [2017, 8, 18],
				departure: [2017, 9, 10]
			},
			tariff: {
				"child_above": 2,
				"guest_above": 2,
				"base_nightly": 100,
				"guest_max": 10,
				"guest_min": 1,
				"child_surcharge": 5,
				"cpd": 0,
				"booking_fee": 0,
				"exec": 0,
				"bond": 0,
				"cpb": 0,
				"cds": 0,
				"guest_surcharge": 8,
				"test_scheme_override": {
					"tax": 1.0,
					"groups": []
				},
				"test_seasons_override": []
			},
			rules: {}
		}
	};

	randomizePostData = {
		booking_info: {
			user_input: {
				guests: {
					adults: "*ALL*",
					children: "*ALL*"
				},
				arrival: "*ALL*",
				departure: "*ALL*"
			},
			tariff: {
				base_nightly: "*ALL*"
			}
		},

		season_test: {
			user_input: {
				arrival: [2017, 8, 27],
				departure: [2017, 9, 6]
			},
			tariff: {
				test_scheme_override: {
					"tax": "*ALL*",
					"groups": [1]
				},
				test_seasons_override: {
					"1":  {
						"name": "Blue Season",
						"pairs": [
							{
								"from": "25/08/2017",
								"to": "10/09/2017"
							}
						]
					}
				},
				group1_rate_type: "*ALL*",
        			group1_perrata_type: "*ALL*",
        			group1_nightly: 160,
        			group1_optional_weekly: 510
			},
			rules: {}
		},

		season_with_rules: {
			user_input: {
				arrival: [2017, 8, 27],
				departure: "*ALL*"
			},
			tariff: {
				test_scheme_override: {
					"tax": 1.0,
					"groups": [1]
				},
				test_seasons_override: {
					"1":  {
						"name": "Blue Season",
						"pairs": [
							{
								"from": "25/08/2017",
								"to": "10/09/2017"
							}
						]
					}
				},
				group1_rate_type: "*ALL*",
        			group1_perrata_type: "*ALL*",
        			group1_nightly: 160,
        			group1_optional_weekly: 510
			},
			rules: {
				"group1_adaysid_item1": "RULE 1",
				"group1_adaysc_item1": "*ALL*",
				"group1_adaysm_item1": "*ALL*",
				"group1_adaysn_item1": 5,
				"group1_adaysv_item1": 201
			}
		}
	}

	injectTestingData(): void {

		// ===== Suite 1 Unit test =====
		// 
		this.testPlan[0].testResultConfig = [
			{
				name: "id",
				title: "ID",
				type: "number"
			},
			{
				name: "basePrice",
				title: "Base Price ($)",
				type: "number"
			},
			{
				name: "los",
				title: "Length Of Stay",
				type: "number"
			},
			{
				name: "adults",
				title: "Adults",
				type: "number"
			},
			{
				name: "children",
				title: "Children",
				type: "number"
			},
			{
				name: "adultsAbove",
				title: "Adult.Sur.Above",
				type: "number"
			},
			{
				name: "adultsSurchargeAbove",
				title: "Adult Surchage/p ($)",
				type: "number"
			},
			{
				name: "childrenAbove",
				title: "Children.Sur.Above",
				type: "number"
			},
			{
				name: "childrenSurchargeAbove",
				title: "Children. Surchage/p ($)",
				type: "number"
			},			
			{
				name: "total",
				title: "Total ($)",
				type: "number"
			},
			{
				name: "guestFee",
				title: "Guest Fee ($)",
				type: "number"
			},
			{
				name: "testResult",
				title: "Test Result",
				type: "string"
			}
		];

		this.testPlan[0].testVector = this.testDataGeneratorService.generateAllTestingDataWithSpec(this.basePostData.no_season,
			this.randomizePostData.booking_info,
			{
				user_input: {
					guests: {
						adults: [0,1,2,3,4],
						children: [0,1,2,3,4]
					},
					arrival: [
						[2017, 8, 15]
					],
					departure: [
						[2017, 9, 15],
						[2017, 9, 16],
						[2017, 9, 20]
					]
				},
				tariff: {
					base_nightly: [100]
				}
			}
		);

		// ===== Suite 2 Unit test =====
		// 
		this.testPlan[1].testResultConfig = [
			{
				name: "id",
				title: "ID",
				type: "number"
			},
			{
				name: "los",
				title: "Length Of Stay",
				type: "number"
			},
			{
				name: "basePrice",
				title: "Base Price ($)",
				type: "number"
			},
			{
				name: "tax",
				title: "Tax Rate",
				type: "number"
			},
			{
				name: "season1PriceType",
				title: "Season Price Type",
				type: "string"
			},
			{
				name: "season1PriceOrFactor",
				title: "Season Price/Factor",
				type: "number"
			},
			{
				name: "season1ProRataUse",
				title: "Pro Rata",
				type: "string"
			},	
			{
				name: "season1OptionalWeekly",
				title: "Optional Weekly",
				type: "string"
			},
			{
				name: "total",
				title: "Total ($)",
				type: "number"
			},
			{
				name: "guestFee",
				title: "Guest Fee ($)",
				type: "number"
			},
			{
				name: "testResult",
				title: "Test Result",
				type: "string"
			}
		];

		this.testPlan[1].testVector = this.testDataGeneratorService.generateAllTestingDataWithSpec(this.basePostData.no_season,
			this.randomizePostData.season_test,
			{
				tariff: {
					test_scheme_override: {
						tax: [1.0,1.5]
					},
					group1_rate_type: ['V', 'F'],
        				group1_perrata_type:  ["PW","PN"],
				}
			}
		);

		// ===== Suite 3 Unit test =====
		// 
		this.testPlan[2].testResultConfig = [
			{
				name: "id",
				title: "ID",
				type: "number"
			},
			{
				name: "los",
				title: "Length Of Stay",
				type: "number"
			},
			{
				name: "basePrice",
				title: "Base Price ($)",
				type: "number"
			},
			{
				name: "season1PriceType",
				title: "Season Price Type",
				type: "string"
			},
			{
				name: "season1PriceOrFactor",
				title: "Season Price/Factor",
				type: "number"
			},
			{
				name: "season1ProRataUse",
				title: "Pro Rata",
				type: "string"
			},	
			{
				name: "season1OptionalWeekly",
				title: "Optional Weekly",
				type: "string"
			},
			{
				name: "season1Rule1ConditionName",
				title: "Condition",
				type: "string"
			},	
			{
				name: "season1Rule1ConditionValue",
				title: "Condition.V",
				type: "number"
			},						
			{
				name: "season1Rule1ActionName",
				title: "Action",
				type: "string"
			},	
			{
				name: "season1Rule1ActionValue",
				title: "Action.V",
				type: "number"
			},				
			{
				name: "total",
				title: "Total ($)",
				type: "number"
			},
			{
				name: "guestFee",
				title: "Guest Fee ($)",
				type: "number"
			},
			{
				name: "testResult",
				title: "Test Result",
				type: "string"
			}
		];

		this.testPlan[2].testVector = this.testDataGeneratorService.generateAllTestingDataWithSpec(this.basePostData.no_season,
			this.randomizePostData.season_with_rules,
			{
				user_input: {
					departure: [
						[2017, 8, 31],
						[2017, 9, 1],
						[2017, 9, 2]
					]
				},
				tariff: {
					group1_rate_type: ['V', 'F'],
        				group1_perrata_type:  ["PW","PN"],
				}, 
				rules: {
					group1_adaysm_item1: TestVectors.condition_type_vector,
					group1_adaysc_item1: TestVectors.action_type_vector
				}
			}
		);

		this.testPlan.forEach((testItem: TestPlanItem) => {
			testItem.currentResultData$ = new BehaviorSubject<TestDataRow[]>([]);
			testItem.numOfTests = testItem.testVector ? testItem.testVector.length : 0;
			testItem.numOfFailures = 0;
			testItem.numOfSuccesses = 0;
		});

	}

	getTestPlanItems(): TestPlanItem[] {
		return this.testPlan;
	}

	// suite number must be 1 - 4
	createTestResult(testItem: TestPlanItem): Observable<TestDataRow[]> {

		let index = this.testPlan.indexOf(testItem);
		
		this.testPlan[index].ybiExistingResponse$ = this.testDataGeneratorService.createTestSquence(this.testPlan[index].testVector);

		return this.testPlan[index].ybiExistingResponse$.map(this.testDataGeneratorService.ybiResponseToTableRow)
				.scan((rows: TestDataRow[], row: TestDataRow): TestDataRow[] => {
					rows.push(row);
					return rows;
				}, []);
	}

	constructor(public testDataGeneratorService: TestDataGeneratorService) {
		this.injectTestingData();
	}

}

export var tablePlanServiceInjectable: Array<any> = [
  bind(TestPlanService).toClass(TestPlanService)
];

