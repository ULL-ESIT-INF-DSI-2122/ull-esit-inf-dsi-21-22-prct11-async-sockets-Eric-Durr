import { expect } from 'chai';
import { describe, it } from 'mocha';
// import Server from '../src/Server.class';
import Client from '../src/Client.class';

describe('Client with o server connected', () => {
  it('Testing data receiving should fail from server', (done) => {
    new Client(8888).on('error', (msg) => {
      expect(msg).to.be.eq('Server is down, try again later');
      done();
    });
  });
});
