import {
  beforeEachProviders,
  describe,
  expect,
  it,
  inject
} from '@angular/core/testing';
import { TariffTestPortalAppComponent } from '../app/tariff-test-portal.component';

beforeEachProviders(() => [TariffTestPortalAppComponent]);

describe('App: TariffTestPortal', () => {
  it('should create the app',
      inject([TariffTestPortalAppComponent], (app: TariffTestPortalAppComponent) => {
    expect(app).toBeTruthy();
  }));

  it('should have as title \'tariff-test-portal works!\'',
      inject([TariffTestPortalAppComponent], (app: TariffTestPortalAppComponent) => {
    expect(app.title).toEqual('tariff-test-portal works!');
  }));
});
