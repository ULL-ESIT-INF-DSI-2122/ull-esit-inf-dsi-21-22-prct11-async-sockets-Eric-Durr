// import Sinon from 'sinon';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import User from '../src/notes/User.class';

// Sinon.stub(console, 'log');

describe('User object tests', () => {
  const myUser = new User('Eric');
  it('User start properties works as expected', () => {
    expect(myUser.userName).to.be.eq('Eric');
    expect(myUser.notes).to.be.eql([]);
  });
  it('User is able to create a note by default', () => {
    expect(myUser.addNote()).to.be.eq(true);
  });
  it('User default note is created as expected', () => {
    // @ts-ignore
    expect(myUser.note(0).title).to.be.eq('New note');
    // @ts-ignore
    expect(myUser.note(0).body).to.be.eq('');
    // @ts-ignore
    expect(myUser.note(0).color).to.be.eq('yellow');
  });
  it('User is able to create two notes by default', () => {
    expect(myUser.addNote()).to.be.eq(true);
  });
  it('User second default note is created as expected', () => {
    // @ts-ignore
    expect(myUser.note(1).title).to.be.eq('New note (1)');
    // @ts-ignore
    expect(myUser.note(1).body).to.be.eq('');
    // @ts-ignore
    expect(myUser.note(1).color).to.be.eq('yellow');
  });
  it('User is able to create defined note', () => {
    expect(myUser.addNote('Shop list', '-water\n-flour', 'red')).to.be.eq(true);
  });
  it('User isn\'t able to create existing note', () => {
    expect(myUser.addNote('Shop list', '-water\n-flour', 'red')).to.be.eq(false);
  });
  it('User is able to create a note only using title', () => {
    expect(myUser.addNote('Routine')).to.be.eq(true);
  });
  it('User second default note is created as expected', () => {
    // @ts-ignore
    expect(myUser.note(2).title).to.be.eq('Shop list');
    // @ts-ignore
    expect(myUser.note(2).body).to.be.eq('-water\n-flour');
    // @ts-ignore
    expect(myUser.note(2).color).to.be.eq('red');
  });
  it('Note can be searched by name', () => {
    expect(myUser.noteByTitle('Shop list')).to.be.eql(myUser.note(2));
  });
  it('User is able to remove existing', () => {
    expect(myUser.removeNote('Shop list')).to.be.eq(true);
    expect(myUser.notes.length).to.be.eq(3);
  });
  it('User isn\'t able to remove a non existing note', () => {
    expect(myUser.removeNote('Shop list')).to.be.eq(false);
    expect(myUser.notes.length).to.be.eq(3);
  });
  it('User is able to edit existing note', () => {
    expect(myUser.editNote('New note', '-water\n-flour\n-eggs', 'blue')).to.be.eq(true);
    // @ts-ignore
    expect(myUser.noteByTitle('New note').body).to.be.eq('-water\n-flour\n-eggs');
    // @ts-ignore
    expect(myUser.noteByTitle('New note').color).to.be.eq('blue');
    expect(myUser.editNote('New note', '-water\n-flour\n-eggs', 'red')).to.be.eq(true);
    expect(myUser.editNote('New note', '-water\n-flour\n-eggs', 'green')).to.be.eq(true);
    expect(myUser.editNote('New note', '-water\n-flour\n-eggs', 'yellow')).to.be.eq(true);
    expect(myUser.editNote('New note', '-water\n-flour\n-eggs', 'purple')).to.be.eq(true);
    // @ts-ignore
    expect(myUser.noteByTitle('New note').color).to.be.eq('yellow');
  });
  it('User isn\'t able to edit non existing note', () => {
    expect(myUser.editNote('Default', '-water\n-flour\n-eggs', 'blue')).to.be.eq(false);
  });
  it('User can read a note by title', () => {
    expect(myUser.readNote('New note (1)'))
      .to.be.eq('New note (1)\n'
        + '────────────\n'
        + '\n');
  });
  it('When a note doesn\'t exist false is returned', () => {
    expect(myUser.readNote('New note (2)')).to.be.false;
  });
});
