import {MorpheusPage} from './app.po';

describe('Babylon App', () => {
    let page: MorpheusPage;

    beforeEach(() => {
        page = new MorpheusPage();
    });

    it('should display welcome message', () => {
        page.navigateTo();
        expect(page.getTitleText()).toEqual('Welcome to Morpheus!');
    });
});
