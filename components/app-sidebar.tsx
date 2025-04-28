"use client";

import * as React from "react";
import {
  ArrowUpCircleIcon,
  CameraIcon,
  ClipboardListIcon,
  DatabaseIcon,
  FileCodeIcon,
  FileIcon,
  FileTextIcon,
  FilmIcon,
  FolderIcon,
  HelpCircleIcon,
  LayoutDashboardIcon,
  SearchIcon,
  SettingsIcon,
  User2,
  UsersIcon,
} from "lucide-react";

import { NavDocuments } from "@/components/nav-documents";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useUser } from "@/lib/UserContext";

// Data placeholder untuk navigasi
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    { title: "Dashboard", url: "/dashboard", icon: LayoutDashboardIcon },
    { title: "Actors", url: "/dashboard/actors", icon: User2 },
    { title: "Movies", url: "/dashboard/movies", icon: FilmIcon },
    { title: "Projects", url: "#", icon: FolderIcon },
    { title: "Team", url: "#", icon: UsersIcon },
  ],
  navClouds: [
    { title: "Capture", icon: CameraIcon, isActive: true, url: "#", items: [] },
    { title: "Proposal", icon: FileTextIcon, url: "#", items: [] },
    { title: "Prompts", icon: FileCodeIcon, url: "#", items: [] },
  ],
  navSecondary: [
    { title: "Settings", url: "#", icon: SettingsIcon },
    { title: "Get Help", url: "#", icon: HelpCircleIcon },
    { title: "Search", url: "#", icon: SearchIcon },
  ],
  documents: [
    { name: "Data Library", url: "#", icon: DatabaseIcon },
    { name: "Reports", url: "#", icon: ClipboardListIcon },
    { name: "Word Assistant", url: "#", icon: FileIcon },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  // Pastikan 'useUser' mengembalikan data user yang valid
  const dataUser = useUser();

  // Cek jika dataUser ada dan valid
  if (!dataUser) {
    return null; // Bisa tampilkan loader atau fallback jika data user tidak ditemukan
  }

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <ArrowUpCircleIcon className="h-5 w-5" />
                <span className="text-base font-semibold">Acme Inc.</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        {/* Pastikan dataUser diteruskan dengan benar */}
        <NavUser user={dataUser} />
      </SidebarFooter>
    </Sidebar>
  );
}
