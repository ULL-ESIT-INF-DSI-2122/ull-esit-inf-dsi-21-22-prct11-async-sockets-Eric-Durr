import * as yargs from 'yargs';
import {
  green,
  red,
  cyan,
  blue,
  yellow,
} from 'chalk';
import Client from './Client.class';
import { Color } from './Note.class';

/**
 * # Colored Message | Custom type
 */
export type ColoredMessage = {
  color: Color,
  content: string,
}

/**
 * # Colored Print | single function
 * Based on the params prints in the terminal content related to notes
 *
 * @param color Color of the note to print
 * @param content string with a formatted Note or a title
 * @param inverse boolean for inverse printing
 */
export function coloredPrint(color: Color, content: string, inverse: boolean = false): void {
  switch (color) {
    case 'red':
      !inverse
        ? console.log(red(content))
        : console.log(red.inverse(content));
      break;
    case 'blue':
      !inverse
        ? console.log(blue(content))
        : console.log(blue.inverse(content));
      break;
    case 'green':
      !inverse
        ? console.log(green(content))
        : console.log(green.inverse(content));
      break;
    default:
      !inverse
        ? console.log(yellow(content))
        : console.log(yellow.inverse(content));
      break;
  }
}

/**
 * # Print Server Info | single function
 * Groups events from class Client to manage server responses as custom emitted events
 *
 * @param client
 */

export function printServerInfo(client: Client): void {
  client.on('success', (message: string) => {
    console.log(green(message));
    client.closeClient();
    process.exit(0);
  });
  client.on('error', (message: string) => {
    console.log(red(message));
    client.closeClient();
    process.exit(1);
  });
  client.on('info', (message: string) => {
    console.log(cyan(message));
    client.closeClient();
    process.exit(0);
  });
  client.on('yellow', (message: string) => {
    console.log(yellow.inverse(message));
    client.closeClient();
    process.exit(0);
  });
  client.on('red', (message: string) => {
    console.log(red.inverse(message));
    client.closeClient();
    process.exit(0);
  });
  client.on('green', (message: string) => {
    console.log(green.inverse(message));
    client.closeClient();
    process.exit(0);
  });
  client.on('blue', (message: string) => {
    console.log(blue.inverse(message));
    client.closeClient();
    process.exit(0);
  });
  client.on('list', (message: string) => {
    const notes: ColoredMessage[] = JSON.parse(message);
    notes.forEach((note: ColoredMessage) => {
      coloredPrint(note.color, note.content);
    });
    client.closeClient();
    process.exit(0);
  });
}

yargs.command({
  command: 'new-user',
  describe: 'Add a new user to system',
  builder: {
    user: {
      describe: 'User name',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.user === 'string') {
      const client: Client = new Client(60300);
      client.createUser(argv.user);
      printServerInfo(client);
    }
  },
});

yargs.command({
  command: 'delete-user',
  describe: 'Remove an existing user from the system',
  builder: {
    user: {
      describe: 'User name',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.user === 'string') {
      const client: Client = new Client(60300);
      client.deleteUser(argv.user);
      printServerInfo(client);
    }
  },
});

yargs.command({
  command: 'list-notes',
  describe: 'Show all notes titles for a user',
  builder: {
    user: {
      describe: 'User name',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.user === 'string') {
      const client: Client = new Client(60300);
      client.listNotes(argv.user);
      printServerInfo(client);
    } else {
      console.log(red('ERROR: User was not especified\n'));
    }
  },
});

yargs.command({
  command: 'read-note',
  describe: 'Read a single note from a user',
  builder: {
    user: {
      describe: 'User name',
      demandOption: true,
      type: 'string',
    },
    title: {
      describe: 'Note title',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.user === 'string') {
      if (typeof argv.title === 'string') {
        const client: Client = new Client(60300);
        client.readNote(argv.user, argv.title);
        printServerInfo(client);
      } else {
        console.log(red('ERROR: Note title was not specified\n'));
      }
    } else {
      console.log(red('ERROR: User was not specified\n'));
    }
  },
});

yargs.command({
  command: 'add-note',
  describe: 'Add a new note',
  builder: {
    user: {
      describe: 'User name',
      demandOption: true,
      type: 'string',
    },
    title: {
      describe: 'Note title',
      demandOption: false,
      type: 'string',
    },
    body: {
      describe: 'Note body',
      demandOption: false,
      type: 'string',
    },
    color: {
      describe: 'Note color',
      demandOption: false,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.user === 'string') {
      const client: Client = new Client(60300);
      client.addNote(
        argv.user,
        typeof argv.title === 'string' ? argv.title : '',
        typeof argv.body === 'string' ? argv.body : '',
        typeof argv.color === 'string' ? argv.color : '',
      );
      printServerInfo(client);
    }
  },
});

yargs.command({
  command: 'edit-note',
  describe: 'Edit a certain note',
  builder: {
    user: {
      describe: 'User name',
      demandOption: true,
      type: 'string',
    },
    title: {
      describe: 'Note title',
      demandOption: true,
      type: 'string',
    },
    body: {
      describe: 'Note body',
      demandOption: false,
      type: 'string',
    },
    color: {
      describe: 'Note color',
      demandOption: false,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.user === 'string') {
      const client: Client = new Client(60300);
      client.editNote(
        argv.user,
        typeof argv.title === 'string' ? argv.title : '',
        typeof argv.body === 'string' ? argv.body : '',
        typeof argv.color === 'string' ? argv.color : '',
      );
      printServerInfo(client);
    }
  },
});

yargs.command({
  command: 'delete-note',
  describe: 'Delete a note from a user',
  builder: {
    user: {
      describe: 'User name',
      demandOption: true,
      type: 'string',
    },
    title: {
      describe: 'Note title',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.user === 'string') {
      if (typeof argv.title === 'string') {
        const client: Client = new Client(60300);
        client.deleteNote(argv.user, argv.title);
        printServerInfo(client);
      } else {
        console.log(red('ERROR: Note title was not specified\n'));
      }
    } else {
      console.log(red('ERROR: User was not specified\n'));
    }
  },
});

yargs.parse();
