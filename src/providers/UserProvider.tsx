import {
  createContext,
  useState,
  useContext,
  useCallback,
  type ReactNode,
  useEffect,
} from "react";
import app from "../config/firebase";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import {type User } from "../types/User";
import { addUser ,getUserById} from "../services/usersDataServiceFireBase";

const UserContext = createContext<{
  user: User | null;
  signup: (userData: any) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
} | undefined>(undefined);

function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const auth = getAuth(app);
  const signup = useCallback(
    async ({email, password,...userData}: {email: string; password: string; userData:any}) => {
     const userCredential = await createUserWithEmailAndPassword(auth, email, password);
     // Add additional user data to Firestore
     await addUser({ id: userCredential.user.uid,email: userCredential.user.email||"",...userData } as any);
    },
    [auth],
  );
  const login = useCallback(
    async (email: string, password: string) => {
      await signInWithEmailAndPassword(auth, email, password);
    },
    [auth],
  );
  const logout = useCallback(async () => {
    await signOut(auth);
    setUser(null);
    window.location.href = "/";
  }, [auth]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if(currentUser) {
      const userData = await getUserById(currentUser.uid);
      if(userData) {
        setUser(userData);
      }
      else {
      setUser(currentUser as any);
      }
    }});

    return unsubscribe;
  }, []);
console.log(user);

  return (
    <UserContext.Provider value={{ user, signup, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}

const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export { UserProvider, useUser };
