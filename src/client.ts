import * as yargs from 'yargs';
import {
  // green,
  red,
  // blue,
  // yellow,
} from 'chalk';

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
      // launch client user creator
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
      // launch client user deletor
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
      // launch client notes lister
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
        // launch client note reader
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
      // launch client note creator
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
      // launch client note editor
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
        // launch client node deletion
      } else {
        console.log(red('ERROR: Note title was not specified\n'));
      }
    } else {
      console.log(red('ERROR: User was not specified\n'));
    }
  },
});

yargs.parse();
