import { createServer } from 'net';
/**
 * # Server Class | Primary parent class
 * manages a server running
 *
 * ## Features
 * - port | number of port to connect
 *
 * ## Methods
 * - runServerCommand() | runs a command sent by a client
 */

export default class Server {
  private port: number;

  constructor(port: number) { this.port = port; }

  public runServer(): void {
    createServer((connection) => {
      connection.write('Connection established');
      connection.on('close', () => {
        console.log('Client has disconected');
      });
      connection.destroy();
    }).listen(this.port, () => {
      console.log(`Server running on port ${this.port}`);
    });
  }
}
