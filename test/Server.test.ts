import { expect } from 'chai';
import { describe, it } from 'mocha';
import Server from '../src/Server.class';
import Client from '../src/Client.class';

describe('Server launch test', () => {
  it('An object server is open until client is closed', (done) => {
    const server: Server = new Server(8787);
    const client: Client = new Client(8787);
    server.runServer(); server.on('close', (info) => {
      expect(info).to.be.eq('client disconnected');
      server.closeServer();
      server.on('terminate', (data) => {
        expect(data).to.be.eq('server terminated');
        done();
      });
    });
    client.closeClient();
  });
});
