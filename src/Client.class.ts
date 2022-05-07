import { connect, Socket } from 'net';
import EventEmitter from 'events';

type OperationInfo = {
  type: 'error' | 'success' | 'info' | 'list',
  message: string,
}

/**
 * # Client Class | Child primary class | extends EventEmitter
 * manages client connection and command message emission to server
 *
 * ## Features
 *
 * - port | number of port to connect
 * - connection | Socket object where client is connected to server
 *
 * ## Methods
 *
 * - createUser() |
 * - deleteUser() |
 * - listNotes() |
 * - addNote() |
 * - readNote() |
 * - editNote() |
 * - deleteNote() |
 * - closeClient() |
 * - handleServerResponse() |
 */

export default class Server extends EventEmitter {
  private readonly port: number;

  private connection: Socket;

  constructor(port: number) {
    super();
    this.port = port;
    this.connection = connect({ port: this.port });
  }

  public createUser(username: string): void {
    console.log('Sending username to server ...');
    this.connection.write(`{ "operation": "new-user", "data": "${username}" }`);
    this.handleServerResponse();
  }

  public deleteUser(username: string): void {
    console.log('Sending username to server ...');
    this.connection.write(`{ "operation": "delete-user", "data": "${username}" }`);
    this.handleServerResponse();
  }

  public listNotes(username: string): void {
    console.log('Retrieving notes from server ...');
    this.connection.write(`{ "operation": "list-notes", "data": "${username}" }`);
    this.handleServerResponse();
  }

  public readNote(username: string, title: string): void {
    console.log('Retrieving note from server ...');
    this.connection.write('{ "operation": "read-note",'
                                + ` "data": { "username": "${username}", "title": "${title}"} }`);
    this.handleServerResponse();
  }

  public addNote(username: string, title: string, body: string, color: string): void {
    console.log('Creating note in server ...');
    this.connection.write('{ "operation": "add-note",'
      + ` "data": { "username": "${username}", "title": "${title}", "body": "${body}", "color": "${color}"}}`);
    this.handleServerResponse();
  }

  public editNote(username: string, title: string, body: string, color: string): void {
    console.log('Editing note in server ...');
    this.connection.write('{ "operation": "edit-note",'
      + ` "data": { "username": "${username}", "title": "${title}", "body": "${body}", "color": "${color}"}}`);
    this.handleServerResponse();
  }

  public deleteNote(username: string, title: string): void {
    console.log('Deleting note in server ...');
    this.connection.write('{ "operation": "delete-note",'
      + ` "data": { "username": "${username}", "title": "${title}"}}`);
    this.handleServerResponse();
  }

  public closeClient() { this.connection.destroy(); }

  private handleServerResponse(): void {
    this.connection.on('error', (err) => {
      if (err.message.split(' ')[1] === 'ECONNREFUSED') {
        this.emit('error', 'Server is down, try again later');
      } else {
        this.emit('error', 'Something went wrong while connecting to server');
      }
    });
    this.connection.on('data', (dataJSON: Buffer) => {
      const data: OperationInfo = JSON.parse(dataJSON.toString());
      if (data.type === 'error') {
        this.emit('error', data.message);
      }
      if (data.type === 'success') {
        this.emit('success', data.message);
      }
      if (data.type === 'info') {
        this.emit('info', data.message);
      }
      if (['red', 'green', 'blue', 'yellow'].includes(data.type)) {
        this.emit(data.type, data.message);
      }
      if (data.type === 'list') {
        this.emit('list', JSON.stringify(data.message));
      }
    });
    this.connection.on('end', () => {
      this.connection.destroy();
    });
  }
}
