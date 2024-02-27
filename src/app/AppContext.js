import { createContext, useContext, useState } from "react";

const AppContext = createContext({});

export const ContextProvider = ({ children }) => {
  const [usersCompleteData, setUsersCompleteData] = useState({});

  return (
    <AppContext.Provider
      value={{
        usersCompleteData,
        setUsersCompleteData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
