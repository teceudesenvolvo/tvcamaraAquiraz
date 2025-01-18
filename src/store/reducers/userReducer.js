// actions
import {
    USER_LOGGED_IN,
    USER_LOGGED_OUT
  } from '../actions/actionsTypes'
  
  const initialState = {
      email: '',
      name: '',
      telefone: '',
      ddd: '',
      userId: '',
      cpf: '',
    };


    const userReducer = (state = initialState, action) => {
      switch (action.type) {
        case USER_LOGGED_IN:
            return {
                ...state,
                name: action.payload.name,
                email: action.payload.email,
                telefone: action.payload.telefone,
                ddd: action.payload.ddd,
                userId: action.payload.userId,
                cpf: action.payload.cpf,
                subId: action.payload.subId,
              };
          case USER_LOGGED_OUT:
            return {
                ...initialState,
            };
        default:
          return state;
      }
    };

    export default userReducer