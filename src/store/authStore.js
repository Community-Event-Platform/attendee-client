import { useSyncExternalStore } from "react";

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
};

let state = { ...initialState };
const listeners = new Set();

const emitChange = () => {
  listeners.forEach((listener) => listener());
};

const setState = (nextState) => {
  state = { ...state, ...nextState };
  emitChange();
};

const readStoredUser = () => {
  const storedUser = localStorage.getItem("user");

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser);
  } catch {
    localStorage.removeItem("user");
    return null;
  }
};

const authActions = {
  login(user, token) {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    setState({
      user,
      token,
      isAuthenticated: Boolean(token),
      isLoading: false,
    });
  },

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setState({ ...initialState });
  },

  initAuth() {
    const token = localStorage.getItem("token");
    const user = readStoredUser();

    setState({
      user,
      token,
      isAuthenticated: Boolean(token),
      isLoading: false,
    });
  },

  updateUser(user) {
    localStorage.setItem("user", JSON.stringify(user));
    setState({ user });
  },
};

const subscribe = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const getSnapshot = () => state;

export const useAuthStore = () => {
  const authState = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  return {
    ...authState,
    ...authActions,
  };
};
