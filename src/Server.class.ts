import { createServer, Socket } from 'net';
import * as fs from 'fs';
import { green, yellow } from 'chalk';
import User from './notes/User.class';
import { Note, Color } from './notes/Note.class';

const allFileNames: string[] = fs.readdirSync('database');

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
  private readonly port: number;

  private user: User;

  private users: string[];

  constructor(port: number) {
    this.port = port;
    this.users = allFileNames;
    this.user = new User('');
  }

  public runServer(): void {
    createServer((connection: Socket) => {
      console.log('A client has connected');
      connection.on('data', (operationJSON: Buffer) => {
        const operation = JSON.parse(operationJSON.toString());
        switch (operation.operation) {
          case 'new-user':
            console.log(`new user ${operation.data} asked for being created`);
            this.newUser(connection, operation.data);
            break;
          case 'delete-user':
            console.log(`user ${operation.data} asked for delete account`);
            this.deleteUser(connection, operation.data);
            break;
          case 'list-notes':
            console.log(`user ${operation.data} retrieved notes list`);
            this.listNotes(connection, operation.data);
            break;
          case 'add-note':
            console.log(`user ${operation.data.username} trying to create a note`);
            this.addNote(
              connection,
              operation.data.username,
              operation.data.title,
              operation.data.body,
              operation.data.color,
            );
            break;
          case 'read-note':
            console.log(`user ${operation.data.username} trying to read note ${operation.data.title}`);
            this.readNote(connection, operation.data.username, operation.data.title);
            break;
          case 'edit-note':
            console.log(`user ${operation.data.username} trying to edit note ${operation.data.title}`);
            this.editNote(
              connection,
              operation.data.username,
              operation.data.title,
              operation.data.body,
              operation.data.color,
            );
            break;
          case 'delete-note':
            console.log(`user ${operation.data.username} trying to delete note ${operation.data.title}`);
            this.deleteNote(connection, operation.data.username, operation.data.title);
            break;
          default:
            break;
        }
      });

      connection.on('close', () => {
        console.log('Client has disconected');
      });
    }).listen(this.port, () => {
      console.log(`Server running on port ${this.port}`);
    });
  }

  // NOTES OPERATIONS

  private newUser(connection: Socket, username: string): void {
    if (this.users.includes(username)) {
      connection.write(`{ "type": "error", "message": "ERROR: user ${username} already exists" }`);
    } else {
      fs.mkdirSync(`database/${username}`);
      connection.write(`{ "type": "success", "message": "user ${username} created" }`);
      this.users = fs.readdirSync('database');
    }
  }

  private deleteUser(connection: Socket, username: string): void {
    if (!this.users.includes(username)) {
      connection.write(`{ "type": "error", "message": "ERROR: user ${username} does not exists" }`);
    } else {
      fs.rmSync(`database/${username}`, { recursive: true, force: true });
      connection.write(`{ "type": "success", "message": "user ${username} deleted" }`);
      this.users = fs.readdirSync('database');
    }
  }

  private addNote(
    connection: Socket,
    username: string,
    title: string,
    body: string,
    color: string,
  ): void {
    if (!this.users.includes(username)) {
      connection.write(`{ "type": "error", "message": "ERROR: user ${username} does not exists" }`);
    } else {
      this.loadUser(username);
      // Note add handler
      if (title === '') {
        this.user.addNote();
        fs.writeFileSync(
          `./database/${username}/${this.user.note(this.user.notes.length - 1)?.title}.json`,
          JSON.stringify(this.user.note(this.user.notes.length - 1)?.JSON),
        );
        connection.write(`{ "type": "success", "message": "Note for user ${username} added successfully" }`);
      } else if (this.user.addNote(title)) {
        // Note body writting
        this.changeProps(body, color);
        // Note persistance
        // @ts-ignore
        fs.writeFileSync(
          `./database/${username}/${this.user.note(this.user.notes.length - 1)?.title}.json`,
          JSON.stringify(this.user.note(this.user.notes.length - 1)?.JSON),
        );
        connection.write(`{ "type": "success", "message": "Note for user ${username} added successfully" }`);
      } else {
        connection.write(`{ "type": "error", "message": "ERROR: note with title ${title} already exists" }`);
      }
    }
  }

  private listNotes(connection: Socket, username: string): void {
    if (!this.users.includes(username)) {
      connection.write(`{ "type": "error", "message": "ERROR: user ${username} does not exists" }`);
    } else {
      this.loadUser(username);
      if (this.user.notes.length === 0) {
        connection.write(`{ "type": "info", "message": "No notes found for ${username} ..." }`);
      } else {
        let messageString: string = '[';
        this.user.notes.forEach((note: Note) => {
          messageString += '{';
          messageString += `"color": "${note.color}",`;
          messageString += `"content": "${note.title}"`;
          messageString += '},';
        });
        messageString = messageString.substring(0, messageString.length - 1);
        messageString += ']';
        connection.write(`{ "type": "list", "message": ${messageString} }`);
      }
    }
  }

  private readNote(
    connection: Socket,
    username: string,
    title: string,
  ): void {
    if (!this.users.includes(username)) {
      connection.write(`{ "type": "error", "message": "ERROR: user ${username} does not exists" }`);
    } else {
      this.loadUser(username);
      if (this.user.notes.length === 0) {
        connection.write(`{ "type": "info", "message": "No notes found for ${username} ..." }`);
      } else if (this.user.noteByTitle(title) instanceof Note) {
        const message = this.user.noteByTitle(title)?.toString();
        connection.write(`{ "type": "${this.user.noteByTitle(title)?.color}",`
                              + `"message": ${JSON.stringify(message)} }`);
      } else {
        connection.write(`{ "type": "error", "message": "ERROR: Note with title ${title} doesn't exist" }`);
      }
    }
  }

  private editNote(
    connection: Socket,
    username: string,
    title: string,
    body: string,
    color: string,
  ): void {
    if (!this.users.includes(username)) {
      connection.write(`{ "type": "error", "message": "ERROR: user ${username} does not exists" }`);
    } else {
      this.loadUser(username);
      if (this.user.noteByTitle(title) instanceof Note) {
        // @ts-ignore
        this.user.noteByTitle(title).body = body === '' ? this.user.noteByTitle(title).body : body;
        // @ts-ignore
        this.user.noteByTitle(title).color = !['red', 'yellow', 'green', 'blue'].includes(color) ? this.user.noteByTitle(title).color
          : color;
        fs.rmSync(`./database/${username}/${title}.json`);
        fs.writeFileSync(
          `./database/${username}/${title}.json`,
          JSON.stringify(this.user.noteByTitle(title)?.JSON),
        );
        connection.write(`{ "type": "success", "message": "Note for user ${username} edited successfully" }`);
      } else {
        connection.write(`{ "type": "error", "message": "ERROR: note with title ${title} does not exists" }`);
      }
    }
  }

  private deleteNote(
    connection: Socket,
    username: string,
    title: string,
  ): void {
    if (!this.users.includes(username)) {
      connection.write(`{ "type": "error", "message": "ERROR: user ${username} does not exists" }`);
    } else {
      this.loadUser(username);
      if (this.user.notes.map((note: Note) => note.title).includes(title)) {
        fs.rmSync(`./database/${username}/${title}.json`);
        connection.write(`{ "type": "success", "message": "Note for user ${username} deleted successfully" }`);
      } else {
        connection.write(`{ "type": "error", "message": "ERROR: Note with title ${title} doesn't exist" }`);
      }
    }
  }

  // REFACTORED HELPERS

  private loadUser(username: string): void {
    this.user = new User(username);
    const notes: string[] = fs.readdirSync(`./database/${username}/`);
    notes.forEach((note) => {
      const noteJSON = JSON
        .parse(fs
          .readFileSync(`./database/${username}/${note}`)
          .toString());
      this.user.addNote(noteJSON.title, noteJSON.body, noteJSON.color);
    });
  }

  private changeProps(body: string, color: string): void {
    // @ts-ignore
    this.user.note(this.user.notes.length - 1).body = body;
    // Note color change
    switch (color) {
      case 'blue':
        // @ts-ignore
        this.user.note(this.user.notes.length - 1).colorIsBlue();
        break;
      case 'yellow':
        // @ts-ignore
        this.user.note(this.user.notes.length - 1).colorIsYellow();
        break;
      case 'green':
        // @ts-ignore
        this.user.note(this.user.notes.length - 1).colorIsGreen();
        break;
      case 'red':
        // @ts-ignore
        this.user.note(this.user.notes.length - 1).colorIsRed();
        break;
      default:
        // @ts-ignore
        this.user.note(this.user.notes.length - 1).colorIsYellow();
        break;
    }
  }
}
