"use client";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface UserPinContextProps {
  pin: string | null;
  setPin: (pin: string) => void;
  clearPin: () => void;
}

const UserPinContext = createContext<UserPinContextProps | undefined>(
  undefined
);

export function UserPinProvider({ children }: { children: ReactNode }) {
  const [pin, setPinState] = useState<string | null>(null);

  useEffect(() => {
    const storedPin = sessionStorage.getItem("user_pin");
    if (storedPin) setPinState(storedPin);
  }, []);

  const setPin = (newPin: string) => {
    sessionStorage.setItem("user_pin", newPin);
    setPinState(newPin);
  };

  const clearPin = () => {
    sessionStorage.removeItem("user_pin");
    setPinState(null);
  };

  return (
    <UserPinContext.Provider value={{ pin, setPin, clearPin }}>
      {children}
    </UserPinContext.Provider>
  );
}

export function usePin() {
  const context = useContext(UserPinContext);
  if (!context) throw new Error("usePin must be used within UserPinProvider");
  return context;
}
