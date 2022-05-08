import { expect } from 'chai';
import { after, describe, it } from 'mocha';
import Sinon from 'sinon';

import Client from '../src/Client.class';
import Server from '../src/Server.class';
import { ColoredMessage } from '../src/client';

Sinon.stub(console, 'log');
describe('Client with no server up', () => {
  it('Testing constructor should fail and handle error from server', (done) => {
    new Client(8888).on('error', (msg) => {
      expect(msg).to.be.eq('Server is down, try again later');
      done();
    });
  });
});

describe('Client with server up', () => {
  const server: Server = new Server(8989);
  const client: Client = new Client(8989);
  server.runServer();
  after(() => {
    server.closeServer();
    client.closeClient();
  });

  it('Client wants to retrieve a notes list for a user with no notes', (done) => {
    client.once('info', (message: string) => {
      expect(message).to.be.eq('No notes found for Eric ...');
      done();
    });
    client.listNotes('Eric');
  });

  it('Client wants to retrieve a notes list for a user with notes', (done) => {
    client.once('list', (message: string) => {
      if (message) {
        const notes: ColoredMessage[] = JSON.parse(message);
        expect(notes
          .map((note: ColoredMessage) => note.content)
          .join(', '))
          .to.be.eq('New note (4), New note (5), New note (6), New note, my new note 2, my new note, my red note');
      }
      done();
    });
    client.listNotes('Pablo');
  });
});
