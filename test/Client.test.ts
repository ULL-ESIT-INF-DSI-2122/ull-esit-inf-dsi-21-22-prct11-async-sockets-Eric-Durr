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
  server.runServer();
  after(() => {
    server.closeServer();
  });

  it('Client wants to do something but user des not exist', (done) => {
    const client: Client = new Client(8989);
    client.once('errormsg', (message: string) => {
      expect(message).to.be.eq('ERROR: user random does not exists');
      client.closeClient();
      done();
    });
    client.listNotes('random');
  });

  it('Client wants to retrieve a notes list for a user with no notes', (done) => {
    const client: Client = new Client(8989);
    client.once('info', (message: string) => {
      if (message) {
        expect(message).to.be.eq('No notes found for Eric ...');
      }
      client.closeClient();
      done();
    });

    client.once('errormsg', (message: string) => {
      if (message) {
        expect(message).to.be.eq('ERROR: user Eric does not exists');
      }
      client.closeClient();
      done();
    });
    client.listNotes('Eric');
  });

  it('Client wants to retrieve a notes list for a user with notes', (done) => {
    const client: Client = new Client(8989);
    client.once('list', (message: string) => {
      const notes: ColoredMessage[] = JSON.parse(message);
      expect(notes
        .map((note: ColoredMessage) => note.content)
        .join(', '))
        .to.be.eq('New note (4), New note (5), New note (6), New note, my new note 2, my new note, my red note');
      client.closeClient();
      done();
    });
    client.listNotes('Pablo');
  });

  it('Client wants to read a note but user has no notes', (done) => {
    const client: Client = new Client(8989);
    client.once('info', (message: string) => {
      if (message) {
        expect(message).to.be.eq('No notes found for Eric ...');
      }
      client.closeClient();
      done();
    });
    client.once('errormsg', (message: string) => {
      if (message) {
        expect(message).to.be.eq('ERROR: user Eric does not exists');
      }
      client.closeClient();
      done();
    });
    client.readNote('Eric', 'No existing');
  });

  it('Client wants to read a note but fails', (done) => {
    const client: Client = new Client(8989);
    client.once('errormsg', (message: string) => {
      expect(message).to.be.eq('ERROR: Note with title No existing doesn\'t exist');
      client.closeClient();
      done();
    });
    client.readNote('Pablo', 'No existing');
  });

  it('Client wants to read a note but succeeds', (done) => {
    const client: Client = new Client(8989);
    client.once('blue', (message: string) => {
      expect(message).to.be.eq('New note (6)\n────────────\nnew body\n');
      client.closeClient();
      done();
    });
    client.readNote('Pablo', 'New note (6)');
  });
});
