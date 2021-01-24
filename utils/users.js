class Users {
  constructor() {
    this.users = [];
  }
  addUser(id, name, room, initials) {
    const usr = {
      id,
      name,
      room,
      initials
    };
    this.users.push(usr);
    return usr;
  }
  removeUser(id) {
    var usr = this.getUser(id);
    if (usr) {
      this.users = this.users.filter((user) => user.id !== id);
    }
    return usr;
  }
  getUser(id) {
    var usr = this.users.filter((user) => user.id === id);
    return usr[0];
  }
  getUserList(room) {
    var users = this.users.filter((user) => user.room === room);
    // var namesArray = users.map((user) => user.name);
    return users;
  }
}

module.exports = { Users };
