var request = require('supertest');

describe('loading express', function () {
    var server;

    beforeEach(function () {
        server = require('../../server');
    });

    afterEach(function () {
        server.close();
    });

    it('responds to /', function testSlash(done) {
        request(server)
        .get('/')
        .expect(200, done);
    });

    it('Google URL test', function testPath(done) {
        request(server)
        .get('/api/auth/google')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, done)
        .expect(function(res) {
            console.log(res.body);
        });
    });

    it('Google authenticate test', function testPath(done) {
        request(server)
        .get('/api/auth/google/authenticate')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, done)
        .expect(function(res) {
            console.log(res.body);
        });
    });

});
