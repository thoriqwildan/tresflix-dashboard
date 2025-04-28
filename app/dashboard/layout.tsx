'use client'

import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { UserProvider } from "@/lib/UserContext";
import { fetchUser, User } from "@/lib/api";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SiteHeader } from "@/components/site-header";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter()

  useEffect(() => {
    async function loadUser() {
      const fetchedUser = await fetchUser();
      setUser(fetchedUser);

      if (!fetchedUser) {
        router.push('/auth/login'); // Redirect to login if no user
      }
    }
    loadUser();
  }, []);


  return (
    <UserProvider user={user}>
      <SidebarProvider>
        <AppSidebar />
        <main>
          <SidebarInset>
            <SiteHeader />
          {children}
          </SidebarInset>
        </main>
      </SidebarProvider>
    </UserProvider>
  );
}
