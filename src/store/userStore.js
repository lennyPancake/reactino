import { makeAutoObservable } from "mobx";
class UserStore {
  users = [];
  mainUser = {
    id: null,
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  };

  constructor() {
    makeAutoObservable(this);
  }

  addUser(user) {
    this.users.push(user);
  }

  getUser(id) {
    console.log("users:", this.users[0]);
    return this.users.find((user) => user.id === id); // Fix the comparison
  }

  async fetchUsers() {
    try {
      const res = await fetch("http://localhost:8000/users");
      const list = await res.json();
      console.log("полученные пользователи", list);
      this.users = [...this.users, ...list];
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }
}

export default UserStore;
