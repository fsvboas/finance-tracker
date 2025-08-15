"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { UserCredentials } from "../types/user-credentials";

interface UserSecretsContextProps {
  credentials: UserCredentials | null;
  setCredentials: (credentials: UserCredentials) => void;
  clearCredentials: () => void;
  isAuthenticated: boolean;
}

const UserSecretsContext = createContext<UserSecretsContextProps | undefined>(
  undefined
);

export function UserSecretsProvider({ children }: { children: ReactNode }) {
  const [credentials, setCredentialsState] = useState<UserCredentials | null>(
    null
  );

  useEffect(() => {
    const storedCredentials = sessionStorage.getItem("user_credentials");
    if (storedCredentials) {
      const parsed = JSON.parse(storedCredentials) as UserCredentials;
      setCredentialsState(parsed);
    }
  }, []);

  const setCredentials = (newCredentials: UserCredentials) => {
    sessionStorage.setItem("user_credentials", JSON.stringify(newCredentials));
    setCredentialsState(newCredentials);
  };

  const clearCredentials = () => {
    sessionStorage.removeItem("user_credentials");
    setCredentialsState(null);
  };

  const isAuthenticated = credentials !== null;

  return (
    <UserSecretsContext.Provider
      value={{
        credentials,
        setCredentials,
        clearCredentials,
        isAuthenticated,
      }}
    >
      {children}
    </UserSecretsContext.Provider>
  );
}

export function useUserSecrets() {
  const context = useContext(UserSecretsContext);
  if (!context) {
    throw new Error(
      "useUserSecrets deve ser usado dentro de UserSecretsProvider"
    );
  }
  return context;
}
