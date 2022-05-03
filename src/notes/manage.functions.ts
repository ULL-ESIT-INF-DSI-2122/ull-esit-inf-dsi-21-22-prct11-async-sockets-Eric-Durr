import fs from 'fs';
import User from './User.class';

function createUserList(username: string): User {
  const currentUser: User = new User(username);
  const notes: string[] = fs.readdirSync(`./database/${username}/`);
  notes.forEach((note) => {
    const noteJSON = JSON
      .parse(fs
        .readFileSync(`./database/${username}/${note}`)
        .toString());
    currentUser.addNote(noteJSON.title, noteJSON.body, noteJSON.color);
  });
  return currentUser;
}

export {
  createUserList,
};
