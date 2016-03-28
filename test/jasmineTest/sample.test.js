describe('sample', function() {

    //beforeEach(module('scorecardApp'));

    //var $controller;

    //beforeEach(inject(function(_$controller_)   {
    //    $controller = _$controller_;
    //}));

    var driveFactory;

    beforeEach(function()   {
        module('driveService');
    });

    beforeEach(inject(function(Drive) {
        driveFactory = Drive;
    }));

    describe('first block', function()  {
        it('first test', function()    {
            //var controller = $controller('driveController', {});

            var mockData = {
                    limit: 16106127360,
                    usage: 2272133153,
                    usageInDrive: 1244809032,
                    usageInDriveTrash: 280395
            };

            var result = driveFactory.parseStorageDataInfoToGb(mockData);


            expect(result.usage).toEqual('2166.875');
            expect(result.limit).toEqual('15360.000');
            expect(result.free).toEqual('13193.125');
            expect(result.usageInDrive).toEqual('1187.142');
            expect(result.usageInDriveTrash).toEqual('0.267');
        });
    });
});
