import { bootstrap } from '@angular/platform-browser-dynamic';
import { enableProdMode, provide, ReflectiveInjector} from '@angular/core';
import {HTTP_PROVIDERS, Request, XSRFStrategy, Http} from "@angular/http";
import { AppComponent, environment } from './app/';
import {trace, UIROUTER_PROVIDERS, UIView, UIRouterConfig, Category, UIROUTER_DIRECTIVES} from "ui-router-ng2";
import {MyUIRouterConfig} from "./app/router.config";

import {LocationStrategy, HashLocationStrategy, PathLocationStrategy, PlatformLocation} from "@angular/common";
import {BrowserPlatformLocation} from '@angular/platform-browser';
import { PLATFORM_DIRECTIVES} from "@angular/core";
import {servicesInjectables} from './app/services/services';
import {AuthDao} from './app/components/hack-http-check';

// import 'vendor/jquery/dist/jquery.js';
// import 'vendor/jquery-ui-dist/jquery-ui.js';
import 'semantic-ui-css/semantic.min.js';
// import 'vendor/ng2-table/bundles/ng2-table.js';
// import 'vendor/ng2-bootstrap/bundles/ng2-bootstrap.js';

if (environment.production) {
  enableProdMode();
}

// var injector = ReflectiveInjector.resolveAndCreate([HTTP_PROVIDERS]);
// var http = injector.get(Http);
class FakeXSRFStrategy implements XSRFStrategy {
  public configureRequest(req: Request) { /* */ }
}

const XRSF_MOCK = provide(XSRFStrategy, { useValue: new FakeXSRFStrategy() });

// ReflectiveInjector.resolveAndCreate([...HTTP_PROVIDERS, XRSF_MOCK, AuthDao])
//   .get(AuthDao)
//   .check()

// http.get('data.json').map(res => res.json())
//     .subscribe(data => {
//         console.log("=== done ===");
//     }
// );

// bootstrap(UIView, [
//     ...UIROUTER_PROVIDERS,
//     provide(UIRouterConfig, { useClass: MyUIRouterConfig })
// ]);

bootstrap(UIView, [
    // Hashbang mode
    // provide(LocationStrategy, { useClass: HashLocationStrategy }),
    // HTML5 push state mode
    provide(LocationStrategy, { useClass: HashLocationStrategy }),
    provide(PlatformLocation, { useClass: BrowserPlatformLocation }),

    ...UIROUTER_PROVIDERS,
    ...HTTP_PROVIDERS,
    provide(XSRFStrategy, { useValue: new FakeXSRFStrategy() }),

    // Provide a custom UIRouterConfig to configure UI-Router
    provide(UIRouterConfig, { useClass: MyUIRouterConfig }),

    servicesInjectables,

    // Make `directives: [UIROUTER_DIRECTIVES]` optional in a @Component
    // by always including them in the PLATFORM_DIRECTIVCES
    provide(PLATFORM_DIRECTIVES, {useValue: [UIROUTER_DIRECTIVES], multi: true})
]);

// bootstrap(AppComponent);
