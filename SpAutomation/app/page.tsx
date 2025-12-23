import { cookies } from "next/headers";
import HomeClient from "./components/HomeClient";

export default async function Page() {
  const cookieStore = await cookies();
  const auth = cookieStore.get("admin-auth");

  if (!auth) {
    return <meta httpEquiv="refresh" content="0; url=/login" />;
  }

  return <HomeClient />;
}
