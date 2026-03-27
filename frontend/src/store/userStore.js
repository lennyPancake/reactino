import { makeAutoObservable } from "mobx";
import { getUsers, updateUser } from "../API/userAPI";
class UserStore {
  users = [];
  mainUser = {
    id: null,
    first_name: "",
    last_name: "",
    email: "",
    avatar: "",
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

  async updateMainUser(userData) {
    try {
      this.isLoading = true;
      const res = await updateUser(userData);
      this.mainUser = res.data;
      sessionStorage.setItem("mainUser", JSON.stringify(res.data));
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    } finally {
      this.isLoading = false;
    }
  }
}

export default UserStore;
