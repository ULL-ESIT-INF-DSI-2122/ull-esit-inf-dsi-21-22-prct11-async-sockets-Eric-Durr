import { connect, Socket } from 'net';
import EventEmitter from 'events';

/**
 * # Client Class | Primary parent class
 * manages client connection and command message emission to server
 *
 * ## Features
 * - port | number of port to connect
 *
 * ## Methods
 * - connectToServer() | connects to a server
 */

export default class Server extends EventEmitter {
  private port: number;

  private connection: Socket;

  constructor(port: number) {
    super();
    this.port = port;
    this.connection = connect({ port: this.port });
  }

  public connectToServer(): void {
    this.connection.on('data', (dataJSON: Buffer) => {
      console.log(dataJSON.toString());
      this.emit('received-data', dataJSON.toString());
    });

    this.connection.on('end', () => {
      this.connection.destroy();
      process.exit(0);
    });
  }
}
