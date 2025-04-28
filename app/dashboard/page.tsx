import { useUser } from "@/hooks/UserContext";
import { redirect } from "next/navigation";

export default function Page() {
  const user = useUser();
  if (!user) {
    redirect("/auth/login");
  }

  return <p>Welcome {user.name}</p>;
}
