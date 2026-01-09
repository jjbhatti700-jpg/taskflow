import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "./lib/auth";
import DatabaseBoard from "./components/DatabaseBoard";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <main
      className="min-h-screen p-8"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      <DatabaseBoard />
    </main>
  );
}