"use client";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface UserSecretsContextProps {
  salt: string | null;
  setSalt: (salt: string) => void;
  clearSalt: () => void;
  pin: string | null;
  setPin: (pin: string) => void;
  clearPin: () => void;
}

const UserSecretsContext = createContext<UserSecretsContextProps | undefined>(
  undefined
);

export function UserSecretsProvider({ children }: { children: ReactNode }) {
  const [pin, setPinState] = useState<string | null>(null);
  const [salt, setSaltState] = useState<string | null>(null);

  useEffect(() => {
    const storedPin = sessionStorage.getItem("user_pin");
    const storedSalt = sessionStorage.getItem("user_salt");
    if (storedPin) setPinState(storedPin);
    if (storedSalt) setPinState(storedSalt);
  }, []);

  const setPin = (newPin: string) => {
    sessionStorage.setItem("user_pin", newPin);
    setPinState(newPin);
  };

  const clearPin = () => {
    sessionStorage.removeItem("user_pin");
    setPinState(null);
  };

  const setSalt = (newSalt: string) => {
    sessionStorage.setItem("user_salt", newSalt);
    setSaltState(newSalt);
  };

  const clearSalt = () => {
    sessionStorage.removeItem("user_salt");
    setSaltState(null);
  };

  return (
    <UserSecretsContext.Provider
      value={{ pin, setPin, clearPin, salt, setSalt, clearSalt }}
    >
      {children}
    </UserSecretsContext.Provider>
  );
}

export function useUserSecrets() {
  const context = useContext(UserSecretsContext);
  if (!context) throw new Error("UserSecrets Error");
  return context;
}
