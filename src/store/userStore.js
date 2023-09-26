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
    this.isLoading = false;
  }
  getUser(id) {
    return this.users.find((user) => user.id === id);
  }

  async fetchUsers() {
    try {
      this.isLoading = true;
      const res = await fetch("http://localhost:8000/users");
      const list = await res.json();
      console.log("полученные пользователи", list);
      this.users = [...this.users, ...list];
      this.isLoading = false;
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }
}

export default UserStore;
