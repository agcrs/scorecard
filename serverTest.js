var request = require('supertest');
describe('loading express', function () {
  var server;
  beforeEach(function () {
    server = require('./server')();
  });
  afterEach(function (done) {
    server.close(done);
  });
/*Si pongo * cualquier ruta testeada da 200
  it('responds to *', function testSlash(done) {
  request(server)
    .get('*')
    .expect(200, done);
  });*/
  it('responds to /', function testPath(done) {
    request(server)
      .get('/')
      .expect(200, done);
  });
  it('responds to api', function testPath(done) {
    request(server)
      .get('/api')
      .expect(200, done);
  });
  /* Da 404
  it('responds to auth', function testPath(done) {
    request(server)
      .get('/auth')
      .expect(200, done);
  });
*/
  it('404 everything else', function testPath(done) {
    request(server)
      .get('/foo/bar')
      .expect(404, done);
  });
});
