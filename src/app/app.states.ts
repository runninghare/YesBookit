 import {AppComponent} from "./index";
 import {Suites} from "./states/suites";
 import {ArbitraryTest} from "./states/arbitrary-test";
 import {Ng2StateDeclaration, Transition} from "ui-router-ng2";
 import {MySpike} from "./components/my-spike";
 import {PreviewRates} from "./components/preview-rates";

 // The top level states
let MAIN_STATES: Ng2StateDeclaration[] = [
  // The top-level app state. This state fills the root
  // <ui-view></ui-view> (defined in index.html) with the AppComponent
  {
    name: 'app',
    url: '/',
    component: AppComponent
  },
  {
    name: 'app.arbitrary',
    url: 'arbitrary',
    component: ArbitraryTest,
    params: {
      fromState: null,
      fromStateParams: null
    },
    resolve: [
      // Inject the bazList (from the parent) and find the correct
      {
        token: 'fromState', deps: [Transition], resolveFn: (trans) => {
          return trans.params().fromState;
        }
      },
      {
        token: 'fromStateParams', deps: [Transition], resolveFn: (trans) => {
          return trans.params().fromStateParams;
        }
      }
    ]
  },
  {
    name: 'app.suites',
    url: 'suite/:name',
    component: Suites,
    params: { 
      name: null 
    },
    resolve: [
      // Inject the bazList (from the parent) and find the correct
      {
        token: 'name', deps: [Transition], resolveFn: (trans) => {
          return trans.params().name;
        }
      }
    ]
  },
  {
    name: 'app.spike',
    url: 'spike',
    component: MySpike
  },
  {
    name: 'app.arbitrary.preview-rates',
    url: '/preview-rates',
    component: PreviewRates
  }
];

 export let INITIAL_STATES: Ng2StateDeclaration[] = MAIN_STATES;