describe('Drive Service Tests', function() {

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

    describe('parseStorageDataInfoToGb', function()  {
        it('Positive Test, should pass.', function()    {
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

        it('Negative Test, should pass.', function()    {
            //var controller = $controller('driveController', {});

            var mockData = {
                    limit: 16106127,
                    usage: 2272153,
                    usageInDrive: 14809032,
                    usageInDriveTrash: 2395
            };

            var result = driveFactory.parseStorageDataInfoToGb(mockData);


            expect(result.usage).not.toEqual('2166.875');
            expect(result.limit).not.toEqual('15360.000');
            expect(result.free).not.toEqual('13193.125');
            expect(result.usageInDrive).not.toEqual('1187.142');
            expect(result.usageInDriveTrash).not.toEqual('0.267');
        });
    });

    describe('countFileTypes', function()  {
        it('Positive Test, one of each defined types.', function()    {
            //var controller = $controller('driveController', {});

            var mockFiles = {
                files: [
                {mimeType: 'application/vnd.google-apps.document'},
                {mimeType: 'application/vnd.google-apps.drawing'},
                {mimeType: 'application/vnd.google-apps.form'},
                {mimeType: 'application/vnd.google-apps.map'},
                {mimeType: 'application/vnd.google-apps.presentation'},
                {mimeType: 'application/vnd.google-apps.spreadsheet'},
                {mimeType: 'application/pdf'},
                {mimeType: 'image/png'},
                {mimeType: 'image/jpeg'},
                {mimeType: 'image/pjpeg'},
                {mimeType: 'image/jpg'},
                {mimeType: 'application/x-compressed'},
                {mimeType: 'application/x-zip-compressed'},
                {mimeType: 'application/zip'},
                {mimeType: 'multipart/x-zip'},
                {mimeType: 'var'}
            ]};

            var result = driveFactory.countFileTypes(mockFiles);


            expect(result.totalArchives).toBe(16);
            expect(result.gDocs).toBe(1);
            expect(result.gDrawings).toBe(1);
            expect(result.gForms).toBe(1);
            expect(result.gMaps).toBe(1);
            expect(result.gSlides).toBe(1);
            expect(result.gSheets).toBe(1);
            expect(result.pdf).toBe(1);
            expect(result.img).toBe(4);
            expect(result.zip).toBe(4);
            expect(result.various).toBe(1);

        });

        it('Positive Test, 2 gDocs and 3 pdf', function()    {
            //var controller = $controller('driveController', {});

            var mockFiles = {
                files: [
                {mimeType: 'application/vnd.google-apps.document'},
                {mimeType: 'application/vnd.google-apps.document'},
                {mimeType: 'application/pdf'},
                {mimeType: 'application/pdf'},
                {mimeType: 'application/pdf'}
            ]};

            var result = driveFactory.countFileTypes(mockFiles);


            expect(result.totalArchives).toBe(5);
            expect(result.gDocs).toBe(2);
            expect(result.gDrawings).toBe(0);
            expect(result.gForms).toBe(0);
            expect(result.gMaps).toBe(0);
            expect(result.gSlides).toBe(0);
            expect(result.gSheets).toBe(0);
            expect(result.pdf).toBe(3);
            expect(result.img).toBe(0);
            expect(result.zip).toBe(0);
            expect(result.various).toBe(0);
        });

        it('Negative Test, pass total bad types', function()    {
            //var controller = $controller('driveController', {});

            var mockFiles = {
                files: [
                {mimeType: 'application/vnd.google-apps.document'},
                {mimeType: 'application/vnd.google-apps.document'},
                {mimeType: 'application/pdf'},
                {mimeType: 'application/pdf'},
                {mimeType: 'application/pdf'}
            ]};

            var result = driveFactory.countFileTypes(mockFiles);


            expect(result.totalArchives).toBe(5);
            expect(result.gDocs).not.toBe(1);
            expect(result.gDrawings).toBe(0);
            expect(result.gForms).toBe(0);
            expect(result.gMaps).toBe(0);
            expect(result.gSlides).toBe(0);
            expect(result.gSheets).toBe(0);
            expect(result.pdf).not.toBe(4);
            expect(result.img).toBe(0);
            expect(result.zip).toBe(0);
            expect(result.various).toBe(0);
        });

        it('Negative Test, pass type bad total', function()    {
            //var controller = $controller('driveController', {});

            var mockFiles = {
                files: [
                {mimeType: 'application/vnd.google-apps.document'},
                {mimeType: 'application/vnd.google-apps.document'},
                {mimeType: 'application/pdf'},
                {mimeType: 'application/pdf'},
                {mimeType: 'application/pdf'}
            ]};

            var result = driveFactory.countFileTypes(mockFiles);


            expect(result.totalArchives).not.toBe(6);
            expect(result.gDocs).not.toBe(1);
            expect(result.gDrawings).toBe(0);
            expect(result.gForms).toBe(0);
            expect(result.gMaps).toBe(0);
            expect(result.gSlides).toBe(0);
            expect(result.gSheets).toBe(0);
            expect(result.pdf).not.toBe(4);
            expect(result.img).toBe(0);
            expect(result.zip).toBe(0);
            expect(result.various).toBe(0);
        });
    });
});
