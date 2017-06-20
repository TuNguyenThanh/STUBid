import { SbidWebPage } from './app.po';

describe('sbid-web App', () => {
  let page: SbidWebPage;

  beforeEach(() => {
    page = new SbidWebPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
