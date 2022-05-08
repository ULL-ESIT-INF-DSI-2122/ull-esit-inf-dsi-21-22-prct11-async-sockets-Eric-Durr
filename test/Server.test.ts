import { expect } from 'chai';
import { describe, it } from 'mocha';
import Server from '../src/Server.class';
import Client from '../src/Client.class';

describe('Server launch test', () => {
  const server: Server = new Server(8989);
  const client: Client = new Client(8989);
  server.runServer();
  it('An object server is open until client is closed', (done) => {
    server.on('close', (info) => {
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
