import axiosClient from "./axiosClient";

export const loginApi = (data) => {
  return axiosClient.post("/login", data);
};

export const registerApi = (data) => {
  return axiosClient.post("/register", data);
};

export const logoutApi = () => {
  return axiosClient.post("/logout");
};