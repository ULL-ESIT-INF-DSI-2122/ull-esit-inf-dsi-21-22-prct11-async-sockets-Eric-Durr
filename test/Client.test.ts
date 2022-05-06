import { expect } from 'chai';
import { describe, it } from 'mocha';
import Server from '../src/Server.class';
import Client from '../src/Client.class';

describe('Client class', () => {
  it('Testing data receiving', (done) => {
    const server = new Server(60300);
    const client = new Client(60300);
    server.runServer();
    client.connectToServer();
    client.on('received-data', (data) => {
      expect(data).to.be.eql('Connection established');
      done();
    });
  });
});
