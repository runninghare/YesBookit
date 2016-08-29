
import {Injectable, bind} from '@angular/core';

@Injectable()
export class TestVectors {

    public static guest_number_vector = [0,1,2,3,4,5,6,7,8,9,10];
    public static rent_price_vector = [100, 110, 120, 130, 140, 500, 800];
    public static small_fee_vector = [8.00, 9.00, 10.00, 15.00, 20.00, 35.00];
    public static nightly_rate_type_vector = ['V', 'F'];
    public static parata_type_vector = ['PW', 'PN'];
    public static season1_name_vector = ["", "Blue Season"];
    public static season2_name_vector = ["", "Orange Season"];
    public static rule1_name_vector = ["", "RULE 1"];
    public static rule2_name_vector = ["", "RULE 2"];

    public static condition_type_vector = ["L", "M", "E", "B", "b", "E5", "D"];
    public static action_type_vector = ["A", "F", "P"];

    public static condition_value_vector = [0, 1, 2, 3, 4, 5, 6, 7];
    public static action_value_vector = [111, 222, 333, 444, 555];

    public static date_all_vector_array = [
        [2017,8,15],
        [2017,8,16],
        [2017,8,17],
        [2017,8,18],
        [2017,8,19],
        [2017,8,20],
        [2017,8,21],
        [2017,8,22],
        [2017,8,23],
        [2017,8,24],
        [2017,8,25],
        [2017,8,26],
        [2017,8,27],
        [2017,8,28],
        [2017,8,29],
        [2017,8,30],
        [2017,8,31],
        [2017,9,1],
        [2017,9,2],
        [2017,9,3],
        [2017,9,4],
        [2017,9,5],
        [2017,9,6],
        [2017,9,7],
        [2017,9,8],
        [2017,9,9],
        [2017,9,10],
        [2017,9,11],
        [2017,9,12],
        [2017,9,13]
    ];
    public static date_string_vector = [
        "15/8/2017",
        "16/8/2017",
        "17/8/2017",
        "18/8/2017",
        "19/8/2017",
        "20/8/2017",
        "21/8/2017",
        "22/8/2017",
        "23/8/2017",
        "24/8/2017",
        "25/8/2017",
        "26/8/2017",
        "27/8/2017",
        "28/8/2017",
        "29/8/2017",
        "30/8/2017",
        "31/8/2017",
        "01/9/2017",
        "02/9/2017",
        "03/9/2017",
        "04/9/2017",
        "05/9/2017",
        "06/9/2017",
        "07/9/2017",
        "08/9/2017",
        "09/9/2017",
        "10/9/2017",
        "11/9/2017",
        "12/9/2017",
        "13/9/2017",
        "14/9/2017",
        "15/9/2017",
    ];

    public static defaultTestSpecs = {
        user_input: {
            guests: {
                adults: TestVectors.guest_number_vector,
                children: TestVectors.guest_number_vector
            }
        },
        tariff: {
            base_nightly: TestVectors.rent_price_vector
        }
    };

    constructor() {
    }
}

export var testVectorServiceInjectable: Array<any> = [
    bind(TestVectors).toClass(TestVectors)
];