 import {AppComponent} from "./index";
 import {Suites} from "./states/suites";
 import {ArbitraryTest} from "./states/arbitrary-test";
 import {Ng2StateDeclaration, Transition} from "ui-router-ng2";

 // The top level states
let MAIN_STATES: Ng2StateDeclaration[] = [
  // The top-level app state. This state fills the root
  // <ui-view></ui-view> (defined in index.html) with the AppComponent
  {
    name: 'app',
    component: AppComponent
  },
  {
    name: 'app.arbitrary',
    component: ArbitraryTest
  },
  {
    name: 'app.suites',
    component: Suites,
    params: { 
      testPlan: null 
    },
    resolve: [
      // Inject the bazList (from the parent) and find the correct
      {
        token: 'testPlan', deps: [Transition], resolveFn: (trans) => {
          return trans.params().testPlan;
        }
      }
    ]
  }
];

 export let INITIAL_STATES: Ng2StateDeclaration[] = MAIN_STATES;