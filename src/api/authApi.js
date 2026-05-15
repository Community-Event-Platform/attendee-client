import axiosClient from "./axiosClient";

export const loginApi = (data) => {
  return axiosClient.post("/login", data);
};

export const registerApi = (data) => {
  return axiosClient.post("/register", data).then(response => {
    // Return the full response for proper handling
    return response;
  });
};

export const logoutApi = () => {
  return axiosClient.post("/logout");
};
