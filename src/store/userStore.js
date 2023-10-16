import { makeAutoObservable } from "mobx";
import { getUsers } from "../API/userAPI";
class UserStore {
  users = [];
  mainUser = {
    id: null,
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  };
  isLoading = false;

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
      const res = await getUsers();
      console.log("полученные пользователи", res.data); //?
      this.users = res.data;
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      this.isLoading = false;
    }
  }
}

export default UserStore;
