import { TariffTestPortalPage } from './app.po';

describe('tariff-test-portal App', function() {
  let page: TariffTestPortalPage;

  beforeEach(() => {
    page = new TariffTestPortalPage();
  })

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('tariff-test-portal works!');
  });
});
