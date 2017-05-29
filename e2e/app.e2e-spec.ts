import { LeafletPage } from './app.po';

describe('leaflet App', () => {
  let page: LeafletPage;

  beforeEach(() => {
    page = new LeafletPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
