import React, {createContext, useReducer} from "react";
import Reducer from '../Reducers/Reducer'


const initialState = {
  currentUser: null,
};

const Store = ({children}) => {
  const [globalState, dispatch] = useReducer(Reducer, initialState);
  return (
    <Context.Provider value={[globalState, dispatch]}>
      {children}
    </Context.Provider>
  )
};

export const Context = createContext(initialState);
export default Store;
