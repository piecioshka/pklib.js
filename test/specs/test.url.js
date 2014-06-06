/*global pklib, location */

describe('pklib.url', function () {
    var test_url = 'http://google.com/?test=1';

    it('identify params', function () {
        var params = pklib.url.getParams(test_url);
        expect(params.test).toBe('1');
    });

    it('identify single param', function () {
        var test_param = pklib.url.getParam('test', test_url);
        expect(test_param).toBe('1');
    });

    it('recognized zero params', function () {
        var params = pklib.url.getParams();

        if (location.search.length > 0) {
            expect(!pklib.object.isEmpty(params)).toBe(true);
        } else {
            expect(pklib.object.isEmpty(params)).toBe(true);
        }
    });
});