import { bootstrap } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { TariffTestPortalAppComponent, environment } from './app/';

if (environment.production) {
  enableProdMode();
}

bootstrap(TariffTestPortalAppComponent);
