'use client'

import { logoutUser } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
    const router = useRouter();

    const logout = async () => {
        try {
            await logoutUser(); // Menunggu hingga logout selesai
            router.push('/auth/login'); // Redirect setelah logout berhasil
        } catch (error) {
            console.error("Error during logout:", error);
            // Jika ada error saat logout, kamu bisa menangani atau memberi tahu user
        }
    };

    useEffect(() => {
        logout(); // Panggil logout saat komponen dimuat
    }, []); // Efek hanya dijalankan sekali saat komponen pertama kali dimuat

    return <p>Logging out...</p>; // Tampilkan status logout
}
