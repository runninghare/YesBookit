export class TariffTestPortalPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('tariff-test-portal-app h1')).getText();
  }
}
