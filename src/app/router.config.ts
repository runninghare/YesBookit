import {UIRouter} from "ui-router-ng2";
import {Injectable, Injector} from "@angular/core";
import {INITIAL_STATES} from "./app.states";
import {Ng2StateDeclaration} from "ui-router-ng2/ng2/interface";
import {TestPlanItem} from './pojo/test-plan';

/**
 * Create your own UIRouterConfig class
 *
 * This class should be added to the Angular 2 bootstrap() providers and is injected by the
 * UIRouter provider.  The UIRouter provider will then invoke this classes configure()
 * function and pass in the UIRouter instance, which we configure.  After configuration,
 * UIRouter syncs up with the current URL.
 */
@Injectable()
export class MyUIRouterConfig {
  constructor(private injector: Injector) {}

  configure(uiRouter: UIRouter) {
    // Register each state definition (from app.states.ts) with the StateRegistry
    INITIAL_STATES.forEach(state => uiRouter.stateRegistry.register(state));

    // Define a default behavior, for when the URL matched no routes
    // uiRouter.urlRouterProvider.otherwise(() => uiRouter.stateService.go("app.suites", {testPlan: new TestPlanItem("Suite 1", "Property Tariff tests without seasonal settings", 5)}, null) && null);
    // uiRouter.urlRouterProvider.otherwise(() => uiRouter.stateService.go("app.arbitrary", null, null) && null);
    uiRouter.urlRouterProvider.otherwise(() => uiRouter.stateService.go("app.spike", null, null) && null);
  }
}
