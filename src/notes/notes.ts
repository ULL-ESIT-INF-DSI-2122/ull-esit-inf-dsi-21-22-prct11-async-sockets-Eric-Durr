import * as fs from 'fs';
import * as yargs from 'yargs';
import {
  green,
  red,
  blue,
  yellow,
} from 'chalk';
import User from './User.class';
import { Note } from './Note.class';
import { createUserList } from './manage.functions';

const allFileNames: string[] = fs.readdirSync('database');

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
      if (!allFileNames.includes(`${argv.user}`)) {
        fs.mkdirSync(`database/${argv.user}`);
        console.log(green(`User ${argv.user} successfully created \n`));
      } else {
        console.log(red('ERROR: User already exists\n'));
      }
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
      if (allFileNames.includes(`${argv.user}`)) {
        fs.rmSync(`database/${argv.user}`, { recursive: true, force: true });
        console.log(green(`User ${argv.user} successfully deleted \n`));
      } else {
        console.log(red('ERROR: User doesn\'t exists\n'));
      }
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
      if (allFileNames.includes(`${argv.user}`)) {
        const notes: string[] = fs.readdirSync(`./database/${argv.user}/`);
        if (notes.length === 0) {
          console.log(`No notes found for ${argv.user} ...`);
          return;
        }
        console.log(`\n${argv.user} notes:\n\n`);
        notes.forEach((note) => {
          const noteObj = JSON
            .parse(fs
              .readFileSync(`./database/${argv.user}/${note}`)
              .toString());
          switch (noteObj.color) {
            case 'blue':
              console.log(blue(`- ${noteObj.title}\n`));
              break;
            case 'yellow':
              console.log(yellow(`- ${noteObj.title}\n`));
              break;
            case 'green':
              console.log(green(`- ${noteObj.title}\n`));
              break;
            case 'red':
              console.log(red(`- ${noteObj.title}\n`));
              break;
            default:
              break;
          }
        });
      } else {
        console.log(red('ERROR: User doesn\'t exist\n'));
      }
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
        if (allFileNames.includes(`${argv.user}`)) {
          const currentUser: User = createUserList(argv.user);
          if (currentUser.notes.length === 0) {
            console.log(`No notes found for ${argv.user} ...`);
            return;
          }
          if (currentUser.noteByTitle(argv.title) instanceof Note) {
            switch (currentUser.noteByTitle(argv.title)?.color) {
              case 'blue':
                console.log(blue.inverse(currentUser.noteByTitle(argv.title)?.toString()));
                break;
              case 'yellow':
                console.log(yellow.inverse(currentUser.noteByTitle(argv.title)?.toString()));
                break;
              case 'green':
                console.log(green.inverse(currentUser.noteByTitle(argv.title)?.toString()));
                break;
              case 'red':
                console.log(red.inverse(currentUser.noteByTitle(argv.title)?.toString()));
                break;
              default:
                break;
            }
          } else {
            console.log(red(`ERROR: Note with title ${argv.title} doesn't exist\n`));
          }
        } else {
          console.log(red('ERROR: User doesn\'t exist\n'));
        }
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
      const currentUser: User = new User(argv.user);
      if (allFileNames.includes(`${argv.user}`)) {
        const notes: string[] = fs.readdirSync(`./database/${argv.user}/`);
        notes.forEach((note) => {
          const noteJSON = JSON
            .parse(fs
              .readFileSync(`./database/${argv.user}/${note}`)
              .toString());
          currentUser.addNote(noteJSON.title, noteJSON.body, noteJSON.color);
        });
      } else {
        fs.mkdirSync(`database/${argv.user}`);
        console.log(green(`User ${argv.user} created \n`));
      }
      if (typeof argv.title === 'string') {
        if (!currentUser.addNote(argv.title)) {
          console.log(red(`ERROR: note with title ${argv.title} already exists`));
          return;
        }
      } else {
        currentUser.addNote();
      }
      if (typeof argv.body === 'string') {
        // @ts-ignore
        currentUser.note(currentUser.notes.length - 1).body = argv.body;
      }
      if (typeof argv.color === 'string') {
        switch (argv.color) {
          case 'blue':
            // @ts-ignore
            currentUser.note(currentUser.notes.length - 1).colorIsBlue();
            break;
          case 'yellow':
            // @ts-ignore
            currentUser.note(currentUser.notes.length - 1).colorIsYellow();
            break;
          case 'green':
            // @ts-ignore
            currentUser.note(currentUser.notes.length - 1).colorIsGreen();
            break;
          case 'red':
            // @ts-ignore
            currentUser.note(currentUser.notes.length - 1).colorIsRed();
            break;
          default:
            break;
        }
      }
      // @ts-ignore
      fs.writeFileSync(
        `./database/${argv.user}/${currentUser.note(currentUser.notes.length - 1)?.title}.json`,
        JSON.stringify(currentUser.note(currentUser.notes.length - 1)?.JSON),
      );
      console.log(green(`Note for ${argv.user} added successfully \n`));
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
      if (allFileNames.includes(`${argv.user}`)) {
        const notes: string[] = fs.readdirSync(`./database/${argv.user}/`);
        if (!notes.includes(`${argv.title}.json`)) {
          console.log(red(`ERROR: Note with title ${argv.title} not found\n`));
        } else {
          const noteObj = JSON
            .parse(fs
              .readFileSync(`./database/${argv.user}/${argv.title}.json`)
              .toString());
          if (typeof argv.body === 'string') {
            noteObj.body = argv.body;
          }
          if (typeof argv.color === 'string') {
            switch (argv.color) {
              case 'blue':
                noteObj.color = 'blue';
                break;
              case 'yellow':
                noteObj.color = 'yellow';
                break;
              case 'green':
                noteObj.color = 'green';
                break;
              case 'red':
                noteObj.color = 'red';
                break;
              default:
                break;
            }
          }
          if (typeof argv.title === 'string') {
            fs.rmSync(`./database/${argv.user}/${argv.title}.json`);
            fs.writeFileSync(
              `./database/${argv.user}/${argv.title}.json`,
              JSON.stringify(noteObj),
            );
            console.log(green(`Note ${argv.title} modified successfully for ${argv.user}\n`));
          }
        }
      } else {
        console.log(red(`ERROR: User ${argv.user} doesn't exist\n`));
      }
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
        if (allFileNames.includes(`${argv.user}`)) {
          const currentUser: User = createUserList(argv.user);
          if (currentUser.notes.length === 0) {
            console.log(`No notes found for ${argv.user} ...`);
            return;
          }
          if (currentUser.removeNote(argv.title)) {
            fs.rmSync(`./database/${argv.user}/${argv.title}.json`);
            console.log(green(`Note with title ${argv.title} removed successfully\n`));
          } else {
            console.log(red(`ERROR: Note with title ${argv.title} doesn't exist\n`));
          }
        } else {
          console.log(red('ERROR: User doesn\'t exist\n'));
        }
      } else {
        console.log(red('ERROR: Note title was not specified\n'));
      }
    } else {
      console.log(red('ERROR: User was not specified\n'));
    }
  },
});

yargs.parse();
