const User = [];

// join user to chat room
function userJoin(id, username, room) {
  const user = { id, username, room };

  User.push(user);

  return user;
}

// Get the current user
function getCurrentUser(id) {
  return User.find((user) => user.id === id);
}

// User leaves chat
function userLeave(id) {
  const index = User.findIndex((user) => user.id === id);

  if (index !== -1) {
    return User.splice(index, 1)[0];
  }
}

// get room users
function getRoomUsers(room) {
  return User.filter((user) => user.room === room);
}

module.exports = {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
};
