// lib/api.ts

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

// Ini fungsi baru, client-side fetch
export async function fetchUser(): Promise<User | null> {
  try {
    const accessToken = sessionStorage.getItem("access_token");
    if (!accessToken) {
      console.warn("No access token found in sessionStorage");
      return null;
    }

    const res = await fetch(`${apiUrl}/auth/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      console.error("Failed to fetch user, status:", res.status);
      return null;
    }

    const data = await res.json();
    return data as User;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    return null;
  }
}

export async function logoutUser() {
  try {
    const res = await fetch(`${apiUrl}/auth/signout`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      console.error("Failed to Logout user, status:", res.status);
      return null;
    }

    console.log("Logout success");

    // Menghapus token dan refresh_token dari sessionStorage
    sessionStorage.removeItem("access_token");
    sessionStorage.removeItem("refresh_token");

    // Mengembalikan response dari server jika ada data yang perlu diambil
    const data = await res.json();
    return data; // Data dari server bisa berisi informasi terkait status logout atau hal lain
  } catch (error) {
    console.error("Failed to Logout user:", error);
    return null;
  }
}
