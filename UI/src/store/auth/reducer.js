import { REMOVE_AUTH_PROFILE, SET_AUTH_PROFILE, SET_AUTH_ROLE, SET_PERSONAL_DATA } from "./action";

const initialState = {
  email: "",
  personal: null,
  role: null
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_AUTH_PROFILE:
      return action.payload;
    case REMOVE_AUTH_PROFILE:
      return initialState;
    case SET_PERSONAL_DATA: {
      return {
        ...state,
        personal: action.payload
      }
    }
    case SET_AUTH_ROLE: {
      return {
        ...state,
        role: action.payload
      }
    }

    default:
      return state;
  }
};

export default authReducer;
