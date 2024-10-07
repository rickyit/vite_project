import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { createContext, useContext, useState } from "react";

type IAuth = {
  user: User | null;
  isAuthLoading: boolean;
};

export const authContext = createContext<IAuth>({
  user: null,
  isAuthLoading: true,
});

//eto is custom hook
export const useAuth = () => {
  return useContext(authContext);
};

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);

  onAuthStateChanged(auth, (authUser) => {
    if (authUser) {
      setUser(authUser);
    } else {
      setUser(null);
    }

    setIsAuthLoading(false);
  });

  const value = {
    isAuthLoading,
    user,
  };
  return (
    <authContext.Provider value={value}>
      {!isAuthLoading && children}
    </authContext.Provider>
  );
};

export default AuthProvider;
