import { bootstrap } from '@angular/platform-browser-dynamic';
import { enableProdMode, provide} from '@angular/core';
import { AppComponent, environment } from './app/';
import {trace, UIROUTER_PROVIDERS, UIView, UIRouterConfig, Category, UIROUTER_DIRECTIVES} from "ui-router-ng2";
import {MyUIRouterConfig} from "./app/router.config";

import {LocationStrategy, HashLocationStrategy, PathLocationStrategy, PlatformLocation} from "@angular/common";
import {BrowserPlatformLocation} from '@angular/platform-browser';
import { PLATFORM_DIRECTIVES} from "@angular/core";

// import 'vendor/jquery/dist/jquery.js';
// import 'vendor/jquery-ui-dist/jquery-ui.js';
import 'semantic-ui-css/semantic.min.js';

if (environment.production) {
  enableProdMode();
}

// bootstrap(UIView, [
//     ...UIROUTER_PROVIDERS,
//     provide(UIRouterConfig, { useClass: MyUIRouterConfig })
// ]);

bootstrap(UIView, [
    // Hashbang mode
    // provide(LocationStrategy, { useClass: HashLocationStrategy }),
    // HTML5 push state mode
    provide(LocationStrategy, { useClass: PathLocationStrategy }),
    provide(PlatformLocation, { useClass: BrowserPlatformLocation }),

    ...UIROUTER_PROVIDERS,

    // Provide a custom UIRouterConfig to configure UI-Router
    provide(UIRouterConfig, { useClass: MyUIRouterConfig }),

    // Make `directives: [UIROUTER_DIRECTIVES]` optional in a @Component
    // by always including them in the PLATFORM_DIRECTIVCES
    provide(PLATFORM_DIRECTIVES, {useValue: [UIROUTER_DIRECTIVES], multi: true})
]);

// bootstrap(AppComponent);
