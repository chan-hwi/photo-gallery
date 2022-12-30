import { createContext, useReducer } from "react";
import useAuth from "../hooks/useAuthLegacy";

const initialUser = {
  user: null,
  token: null,
};

export const actions = {
  SET_USER: 0,
  SET_TOKEN: 1,
  SET_AUTH: 2,
  LOGOUT: 3,
};

function reducer(state, action) {
  switch (action.type) {
    case actions.SET_USER:
      return { ...state, user: action.payload };
    case actions.SET_TOKEN:
      return { ...state, token: action.payload };
    case actions.SET_AUTH:
      return action.payload;
    case actions.LOGOUT:
      return initialUser;
    default:
      return state;
  }
}

export const UserContext = createContext();

function UserProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialUser);
  const { api, login, register, getUserInfo, logout } = useAuth({
    token: state.token,
    dispatch,
  });

  return (
    <UserContext.Provider
      value={{
        state,
        dispatch,
        api,
        login,
        register,
        getUserInfo,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export default UserProvider;
