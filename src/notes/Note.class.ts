export type Color = 'yellow' | 'blue' | 'red' | 'green';

/**
 * # Note | Primary parent class
 * Note structure, properties and operations
 *
 * ## Features
 *
 * - title
 * - body
 * - color | 'red', 'green', 'blue' or 'yellow'(default)
 *
 */

export class Note {
  private _title: string;

  private _body: string;

  private _color: Color;

  constructor(
    title = 'New note',
    body = '',
    color: Color = 'yellow',
  ) {
    this._title = title;
    this._body = body;
    this._color = color;
  }

  get title(): string { return this._title; }

  set title(value: string) { this._title = value; }

  get body(): string { return this._body; }

  set body(value: string) { this._body = value; }

  get color(): Color { return this._color; }

  public colorIsYellow() { this._color = 'yellow'; }

  public colorIsBlue() { this._color = 'blue'; }

  public colorIsRed() { this._color = 'red'; }

  public colorIsGreen() { this._color = 'green'; }

  public toString() {
    let output = `${this.title}\n`;
    output += `${'─'.repeat(this.title.length)}\n`;
    output += `${this.body}\n`;
    return output;
  }

  get JSON() {
    return {
      title: `${this.title}`,
      body: `${this.body}`,
      color: `${this.color}`,
    };
  }

  get toJSONString(): string {
    return '{\n'
      + `\t"title": "${this.title}",\n`
      + `\t"body": "${this.body}",\n`
      + `\t"color": "${this.color}"\n`
      + '}\n';
  }
}
