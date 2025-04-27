"use client";

import { createContext, useContext, useState, useEffect } from "react";

// Definisikan tipe user
interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  status: string;
}

const UserContext = createContext<User | null>(null);

// UserProvider yang menyimpan state user
export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("http://localhost:3000/auth/me", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data);
        }
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    }

    fetchUser();
  }, []);

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}

// Hook untuk mendapatkan data user
export function useUser() {
  return useContext(UserContext);
}
