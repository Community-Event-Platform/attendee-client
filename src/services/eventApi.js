import axiosClient from "./axiosClient";

export const getEvents = async () => {
  const response = await axiosClient.get("/events");
  return response.data.data;
};
