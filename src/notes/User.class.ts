import { Note, Color } from './Note.class';
/**
 * # User | Primary parent class
 * User representation of note app
 *
 * ## Features
 *
 * - notes | array of notes of the user
 * - userName | String with the username
 *
 * ## Methods
 * - note(inx) | returns a single note by index
 * - noteByTitle(title) | returns a single note found by title or undefined
 * - addNote(title?, body?, color?) | adds a note by default or using their properties, returns a boolean with success info
 * - editNote(title?, body, color) | edits a note from the list
 * - removeNote(title) | deletes a note by title from the user list
 * - readNote(title) | returns a formatted String of the note
 */

export default class User {
  private _notes: Note[];

  private readonly _userName: string;

  constructor(userName: string) {
    this._userName = userName;
    this._notes = [];
  }

  get notes(): Note[] {
    return this._notes;
  }

  public note(inx: number): Note | undefined {
    return this.notes.find((_, i) => i === inx);
  }

  public noteByTitle(title: string): Note | undefined {
    return this.notes.find((note) => note.title === title);
  }

  get userName(): string { return this._userName; }

  public addNote(title?: string, body?: string, color?: Color): boolean {
    if (!this.notes.find((el) => el.title === title)) {
      if (title !== undefined && body !== undefined && color !== undefined) {
        this.notes.push(new Note(title, body, color));
      } else if (title !== undefined && (body === undefined || color === undefined)) {
        this.notes.push(new Note(title));
      } else if (this.notes.find((el) => el.title === 'New note')) {
        this.notes.push(new Note(`New note (${this.notes.length})`));
      } else {
        this.notes.push(new Note());
      }
      return true;
    }
    return false;
  }

  public editNote(title: string, body: string, color: string): boolean {
    if (typeof this.noteByTitle(title) !== 'undefined') {
      // @ts-ignore
      this.noteByTitle(title).body = body;
      switch (color) {
        case 'blue':
          this.noteByTitle(title)?.colorIsBlue();
          break;
        case 'yellow':
          this.noteByTitle(title)?.colorIsYellow();
          break;
        case 'green':
          this.noteByTitle(title)?.colorIsGreen();
          break;
        case 'red':
          this.noteByTitle(title)?.colorIsRed();
          break;
        default:
          break;
      }
      return true;
    }
    return false;
  }

  public removeNote(title: string): boolean {
    if (this.notes.find((el) => el.title === title)) {
      this._notes = this._notes.filter((n) => n.title !== title);
      return true;
    }
    return false;
  }

  public readNote(title: string): string | false {
    if (typeof this.noteByTitle(title) !== 'undefined') {
      // @ts-ignore
      return this.noteByTitle(title).toString();
    }
    return false;
  }
}
