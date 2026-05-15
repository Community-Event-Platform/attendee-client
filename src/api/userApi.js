// src/api/userApi.js

import axiosClient from "./axiosClient";

export const getProfileApi = () => {
  return axiosClient.get("/profile");
};