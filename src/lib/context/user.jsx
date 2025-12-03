import { createContext, useContext, useEffect, useState } from "react";
import { account } from "../../appwriteConfig";
import { ID } from "appwrite";

const UserContext = createContext();

export function useUser() {
  return useContext(UserContext);
}

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (email, password) => {
    await account.createEmailPasswordSession(email, password);
    const userInfo = await account.get();
    setUser(userInfo);
  };

  const signup = async (email, password, name) => {
    await account.create(ID.unique(), email, password, name);
    await login(email, password);
  };

  const logout = async () => {
    await account.deleteSession("current");
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const userInfo = await account.get();
      setUser(userInfo);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </UserContext.Provider>
  );
}
