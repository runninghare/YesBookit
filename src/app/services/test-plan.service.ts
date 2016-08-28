import {Injectable, bind} from '@angular/core';
import {RatePostData} from '../pojo/post-data';
import {UiTableConfig, UiTable, UITableAction, UiTableOptions} from '../components/ui-table';
import {TestPlanItem, TestDataRow} from '../pojo/test-plan';
import {TestDataGeneratorService} from '../services/test-data-generator.service';
import {Observable, Subject, BehaviorSubject} from 'rxjs/Rx';
import {YBIExistingTariffResponseResult, YBIExistingTariffResponse} from '../pojo/ybi-tariff-response';

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

	basePostData = {
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
				"base_nightly": 0,
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
					"groups": []
				},
				"test_seasons_override": []
			},
			rules: {
				"group1_adaysc_item1": "P",
				"group1_adaysid_item1": "RULE 1",
				"group1_adaysm_item1": "M",
				"group1_adaysn_item1": 20,
				"group1_adaysv_item1": 201,
				"group1_adaysc_item2": "P",
				"group1_adaysid_item2": "RULE 2",
				"group1_adaysm_item2": "L",
				"group1_adaysn_item2": 30,
				"group1_adaysv_item2": 168
			}
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
		}
	}

	injectTestingData(): void {

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
						adults: [0,1,5],
						children: [0,1,5]
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
	createTestResult(suite: number): Observable<TestDataRow[]> {
		
		this.testPlan[suite-1].ybiExistingResponse$ = this.testDataGeneratorService.createTestSquence(this.testPlan[suite-1].testVector);

		return this.testPlan[suite-1].ybiExistingResponse$.map(this.testDataGeneratorService.ybiResponseToTableRow)
				.scan((rows: TestDataRow[], row: TestDataRow): TestDataRow[] => {
					rows.push(row);
					return rows;
				}, []);
	}

	constructor(public testDataGeneratorService: TestDataGeneratorService) {
		console.log("--- construct test-plan service ---");
		this.injectTestingData();
	}

}

export var tablePlanServiceInjectable: Array<any> = [
  bind(TestPlanService).toClass(TestPlanService)
];

