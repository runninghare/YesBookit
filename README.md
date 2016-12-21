# Angular2 Tariff Testing Portal

This UI portal was built using Angular 2, aiming at producing a visual way for one to quickly understand how YBI tariff works. It also provides more than 700 predefined testing vectors for unit/regression test usage.

## Features

- Arbitrary test of YBI tariff
- Compare the rates calculated from traditional YBI tariff (tariff-comp.pl) and TCEF
- Execute predefined unit tests and triage problems.

## Installation

At the moment this portal was written using an old version of angular2 (2.0.0-rc.4) as well as angular-cli (v0.0.39). To run it in development environment, do following:

1. Install dependencies
```
npm install
```

2. Start angular2 server with live reloading
```
./node_modules/angular-cli/bin/ng serve
```
The server will be hosted at http://localhost:4200

## Deployment

To deploy the application, you need to do:

1. Create the `dist/` folder
```
./node_modules/angular-cli/bin/ng build
```

2. Copy this `dist/` folder to production server

**Important**: If you want to run this application as a standalone server, you don't need to modify any files, just host it using whatever static http server tools. e.g. to host it with `http-server` on port 8080
```
http-server dist/ -p 8080
```
However, if you want to add `dist/` to an existing web server, such as apache, at a specific path, say: http://app102.yesbookit.com/angular-testing-portal, you should do following:

- copy `dist/` folder to the target location of your existing server, and rename it to `angular-testing-portal/`
- Modify this line in `angular-testing-portal/index.html`, changing it to
```
<base href="/angular-testing-portal">
```
- Now you can access the portal at http://app102.yesbookit.com/angular-testing-portal/

## Back End data provider

This portal is a single page application which is only responsible for rendering look and feel. The real business logic and rates are actually calculated by YBI's Perl CGI scripts behind scenes.

You must make sure following scripts work properly otherwise you will see all data being empty at the portal.

- `/cgi-bin/test-tariff.pl`
This API accepts POST request about tariff scheme/user inputs, and responds with the calculated rates and detail from both traditional Tariff and TCEF.

POST body example:
```
{
	"tariff": {
		"group2_perrata_type": "PN",
		"cpb": "15",
		"exec": 0,
		"group2_nightly": 2.5,
		"base_nightly": "125",
		"cpd": "3",
		"test_scheme_override": {
			"tax": 1,
			"groups": []
		},
		"guest_max": "10",
		"group1_rate_type": "V",
		"bond": "500",
		"booking_fee": "8",
		"guest_above": "2",
		"test_seasons_override": {
			"1": {
				"name": "Blue Season",
				"perrata_type": "PN",
				"rate_type": "V",
				"nightly": "199",
				"optional_weekly": "500",
				"pairs": []
			},
			"2": {
				"perrata_type": "PN",
				"name": "Orange Season",
				"rate_type": "F",
				"nightly": 2.5,
				"optional_weekly": null,
				"pairs": []
			}
		},
		"group1_nightly": "199",
		"child_surcharge": "7",
		"group2_rate_type": "F",
		"child_above": "0",
		"guest_min": "1",
		"guest_surcharge": "11",
		"group1_optional_weekly": "500",
		"group1_perrata_type": "PN",
		"cds": "3"
	},
	"user_input": {
		"departure": [2017, 9, 10],
		"guests": {
			"adults": 1,
			"children": 0
		},
		"arrival": [2017, 8, 18]
	},
	"rules": {}
}
```

Sample response:
```
{
  "post_data": {
    "rules": {},
    "user_input": {
      "departure": [
        2017,
        9,
        10
      ],
      "guests": {
        "adults": 1,
        "children": 0
      },
      "arrival": [
        2017,
        8,
        18
      ]
    },
    "tariff": {
      "test_scheme_override": {
        "tax": 1,
        "groups": []
      },
      "cpb": "15",
      "group1_perrata_type": "PN",
      "group1_optional_weekly": "500",
      "guest_surcharge": "11",
      "bond": "500",
      "test_seasons_override": {
        "1": {
          "optional_weekly": "500",
          "nightly": "199",
          "pairs": [],
          "name": "Blue Season",
          "perrata_type": "PN",
          "rate_type": "V"
        },
        "2": {
          "name": "Orange Season",
          "rate_type": "F",
          "perrata_type": "PN",
          "pairs": [],
          "nightly": 2.5,
          "optional_weekly": null
        }
      },
      "group1_nightly": "199",
      "base_nightly": "125",
      "group1_rate_type": "V",
      "child_surcharge": "7",
      "group2_perrata_type": "PN",
      "child_above": "0",
      "guest_min": "1",
      "cpd": "3",
      "exec": 0,
      "guest_max": "10",
      "booking_fee": "8",
      "group2_nightly": 2.5,
      "cds": "3",
      "guest_above": "2",
      "group2_rate_type": "F"
    }
  },
  "result2": [
    {
      "xfee": 2875,
      "bond": 500,
      "total": 2883,
      "clean": 39,
      "xgs": 2875,
      "desc": "<li>Crossover rates (23 nights in total): <ul><li>Calculate rates in range [20170815, 20170923]:</li>  <ul>    <li>Arrival Date in this range:    20170818</li>    <li>Length of Stay in this range:  23</li>    <li>Calculated Rates:            $2875</li>    <li>Rule:                          Base property rates: 125 per day</li>  </ul></ul></li><li>Crossover rates (23 nights in total): <ul><li>Calculate rates in range [20170815, 20170923]:</li>  <ul>    <li>Arrival Date in this range:    20170818</li>    <li>Length of Stay in this range:  23</li>    <li>Calculated Rates:            $0</li>    <li>Rule:                          Adult surcharge: guest number above 2 will be charged $11 per guest per night</li>  </ul></ul></li><li>A booking service fee of $8 applies</li><li>A refundable security deposit of $500 applies</li><li>Crossover rates (23 nights in total): <ul><li>Calculate rates in range [20170815, 20170923]:</li>  <ul>    <li>Arrival Date in this range:    20170818</li>    <li>Length of Stay in this range:  23</li>    <li>Calculated Rates:            $39</li>    <li>Rule:                          Cleaning fee: Use 3-day block with $3 for each block, and a per booking fee of $15</li>  </ul></ul></li>",
      "Bfee": 8,
      "gs": 0
    }
  ],
  "result": [
    {
      "bond": "500.00",
      "gmin": "1",
      "vtotal": "2,883.00",
      "gmax": "10",
      "price": "125.00",
      "xfee": "2875.00",
      "adjust": 0,
      "gs": "0.00",
      "Bfee": "8.00",
      "day": "",
      "desc": "<li>Rent - Basic Rate, 23 nights at $125 per night = <b>$2875</b></li><li>Rates are for 2 adults and 0 children, a surcharge of $11.00 applies to each additional adult, and $7.00 applies to each additional child per night.</li><li>A booking service fee of $8.00 applies</li><li>A refundable security deposit of $500 applies</li><li>A cleaning fee of $39.00 applies</li>",
      "xgs": "2875.00",
      "clean": "39.00",
      "day1": "",
      "total": "2883.00"
    }
  ],
  "tariff_file": "YBI-b9y8SvUtvv93wGFm"
}
```

- `/cgi-bin/test-calc-tcef-rates.pl`

This API calculates bulk rates, which provides data for the Preview charts.

- Sample Post data
```
{
	"ranges": {
		"arrival_date": [20170815, 20170923],
		"los": [1, 7],
		"adults": 1,
		"children": 0
	},
	"tariff": {
		"exec": 0,
		"guest_surcharge": "11",
		"cds": "3",
		"guest_min": "1",
		"base_nightly": "125",
		"group1_rate_type": "V",
		"group2_nightly": 2.5,
		"group1_optional_weekly": "500",
		"booking_fee": "8",
		"child_surcharge": "7",
		"group1_nightly": "199",
		"group2_perrata_type": "PN",
		"test_scheme_override": {
			"groups": [1],
			"tax": 1
		},
		"test_seasons_override": {
			"1": {
				"name": "Blue Season",
				"optional_weekly": "500",
				"perrata_type": "PN",
				"rate_type": "V",
				"pairs": [{
					"from": "15/08/2017",
					"to": "13/09/2017"
				}],
				"nightly": "199"
			},
			"2": {
				"name": "Orange Season",
				"perrata_type": "PN",
				"optional_weekly": null,
				"rate_type": "F",
				"nightly": 2.5,
				"pairs": []
			}
		},
		"guest_above": "2",
		"cpd": "3",
		"child_above": "0",
		"cpb": "15",
		"guest_max": "10",
		"group2_rate_type": "F",
		"group1_perrata_type": "PN",
		"bond": "500"
	},
	"rules": {}
}
```

- Sample output
```
[
  [
    225,
    424,
    623,
    825,
    1024,
    1223,
    532
  ],
  [
    225,
    424,
    623,
    825,
    1024,
    1223,
    532
  ],
  [
    225,
    424,
    623,
    825,
    1024,
    1223,
    532
  ],
  [
    225,
    424,
    623,
    825,
    1024,
    1223,
    532
  ],
  [
    225,
    424,
    623,
    825,
    1024,
    1223,
    532
  ],
  [
    225,
    424,
    623,
    825,
    1024,
    1223,
    532
  ],
  [
    225,
    424,
    623,
    825,
    1024,
    1223,
    532
  ],
  [
    225,
    424,
    623,
    825,
    1024,
    1223,
    532
  ],
  [
    225,
    424,
    623,
    825,
    1024,
    1223,
    532
  ],
  [
    225,
    424,
    623,
    825,
    1024,
    1223,
    532
  ],
  [
    225,
    424,
    623,
    825,
    1024,
    1223,
    532
  ],
  [
    225,
    424,
    623,
    825,
    1024,
    1223,
    532
  ],
  [
    225,
    424,
    623,
    825,
    1024,
    1223,
    532
  ],
  [
    225,
    424,
    623,
    825,
    1024,
    1223,
    532
  ],
  [
    225,
    424,
    623,
    825,
    1024,
    1223,
    532
  ],
  [
    225,
    424,
    623,
    825,
    1024,
    1223,
    532
  ],
  [
    225,
    424,
    623,
    825,
    1024,
    1223,
    532
  ],
  [
    225,
    424,
    623,
    825,
    1024,
    1223,
    532
  ],
  [
    225,
    424,
    623,
    825,
    1024,
    1223,
    532
  ],
  [
    225,
    424,
    623,
    825,
    1024,
    1223,
    532
  ],
  [
    225,
    424,
    623,
    825,
    1024,
    1223,
    532
  ],
  [
    225,
    424,
    623,
    825,
    1024,
    1223,
    532
  ],
  [
    225,
    424,
    623,
    825,
    1024,
    1223,
    532
  ],
  [
    225,
    424,
    623,
    825,
    1024,
    1223,
    532
  ],
  [
    225,
    424,
    623,
    825,
    1024,
    1223,
    532
  ],
  [
    225,
    424,
    623,
    825,
    1024,
    1223,
    532
  ],
  [
    225,
    424,
    623,
    825,
    1024,
    1223,
    532
  ],
  [
    225,
    424,
    623,
    825,
    1024,
    1223,
    532
  ],
  [
    225,
    424,
    623,
    825,
    1024,
    1223,
    532
  ],
  [
    151,
    276,
    401,
    529,
    654,
    779,
    907
  ],
  [
    151,
    276,
    401,
    529,
    654,
    779,
    907
  ],
  [
    151,
    276,
    401,
    529,
    654,
    779,
    907
  ],
  [
    151,
    276,
    401,
    529,
    654,
    779,
    907
  ],
  [
    151,
    276,
    401,
    529,
    654,
    779,
    0
  ],
  [
    151,
    276,
    401,
    529,
    654,
    0,
    0
  ],
  [
    151,
    276,
    401,
    529,
    0,
    0,
    0
  ],
  [
    151,
    276,
    401,
    0,
    0,
    0,
    0
  ],
  [
    151,
    276,
    0,
    0,
    0,
    0,
    0
  ],
  [
    151,
    0,
    0,
    0,
    0,
    0,
    0
  ],
  [
    0,
    0,
    0,
    0,
    0,
    0,
    0
  ]
]
```
