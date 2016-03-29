describe('Auth Service Tests', function() {

    //beforeEach(module('scorecardApp'));

    //var $controller;

    //beforeEach(inject(function(_$controller_)   {
    //    $controller = _$controller_;
    //}));

    var authTokenFactory, mockWindow;

    beforeEach(function()   {
        module(function($provide){
            $provide.service('$window', function(){
                this.localStorage = jasmine.createSpy('localStorage');
                this.localStorage.setItem = jasmine.createSpy('setItem');
                this.localStorage.getItem = jasmine.createSpy('getItem');
                this.localStorage.removeItem = jasmine.createSpy('removeItem');
            });
        });

        module('authService');
    });

    beforeEach(inject(function(AuthToken, $window) {
        authTokenFactory = AuthToken;
        mockWindow = $window;
    }));

    describe('getToken', function()  {
        it('Positive Test, checks if getItem and setItem from $window.localStorage have been called.', function()    {

            var result = authTokenFactory.getToken();

            expect(mockWindow.localStorage.getItem).toHaveBeenCalled();
        });

        it('Positive Test, checks if setItem from $window.localStorage has been called.', function()    {

            var token = {name: 'SampleToken'};

            authTokenFactory.setToken(token);

            expect(mockWindow.localStorage.setItem).toHaveBeenCalledWith('token', token);
        });

        it('Negative Test, checks if setItem from $window.localStorage has been called.', function()    {

            var token = {name: 'SampleToken'};

            authTokenFactory.setToken();

            expect(mockWindow.localStorage.setItem).not.toHaveBeenCalled();
        });

        it('Negative Test, checks if setItem from $window.localStorage has been called with proper token.', function()    {

            var token = {name: 'SampleToken'};
            var anotherToken = {};

            authTokenFactory.setToken(token);

            expect(mockWindow.localStorage.setItem).not.toHaveBeenCalledWith('token', anotherToken);
        });

        it('Positive Test, checks if removeItem from $window.localStorage has been called.', function()    {

            authTokenFactory.setToken();

            expect(mockWindow.localStorage.removeItem).toHaveBeenCalled();
        });

        it('Negative Test, checks if removeItem from $window.localStorage has been called.', function()    {

            var token = {name: 'SampleToken'};

            authTokenFactory.setToken(token);

            expect(mockWindow.localStorage.removeItem).not.toHaveBeenCalled();
        });
    });

});
