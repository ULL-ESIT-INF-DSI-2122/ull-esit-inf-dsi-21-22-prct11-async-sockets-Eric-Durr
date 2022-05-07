// import Sinon from 'sinon';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { Note } from '../src/Note.class';

// Sinon.stub(console, 'log');

describe('Default note object tests', () => {
  const defaultNote = new Note();
  it('Default note title is \'New note\'', () => {
    expect(defaultNote.title).to.be.eq('New note');
  });
  it('Default note body is empty', () => {
    expect(defaultNote.body).to.be.eq('');
  });
  it('Default note color is yellow', () => {
    expect(defaultNote.color).to.be.eq('yellow');
  });
  it('Default note title can be modified', () => {
    defaultNote.title = 'My default note';
    expect(defaultNote.title).to.be.eq('My default note');
  });
  it('Default note body can be modified', () => {
    defaultNote.body = 'Hello world';
    expect(defaultNote.body).to.be.eq('Hello world');
  });
  it('Default note color can be changed to red', () => {
    defaultNote.colorIsRed();
    expect(defaultNote.color).to.be.eq('red');
  });
  it('Default note color can be changed to blue', () => {
    defaultNote.colorIsBlue();
    expect(defaultNote.color).to.be.eq('blue');
  });
  it('Default note color can be changed to green', () => {
    defaultNote.colorIsGreen();
    expect(defaultNote.color).to.be.eq('green');
  });
  it('Default note color can be changed back to yellow', () => {
    defaultNote.colorIsYellow();
    expect(defaultNote.color).to.be.eq('yellow');
  });
  it('note to string reveals title and body formatted', () => {
    expect(defaultNote.toString()).to.be.eq('My default note\n'
      + '───────────────\n'
      + 'Hello world\n');
  });
  it('note JSON object can be accessed', () => {
    expect(defaultNote.JSON).to.be.eql(
      {
        title: 'My default note',
        body: 'Hello world',
        color: 'yellow',
      },
    );
  });
  it('note JSON object can be accessed as string', () => {
    expect(defaultNote.toJSONString).to.be.eql(
      '{\n'
      + `\t"title": "${defaultNote.title}",\n`
      + `\t"body": "${defaultNote.body}",\n`
      + `\t"color": "${defaultNote.color}"\n`
      + '}\n',
    );
  });
});
