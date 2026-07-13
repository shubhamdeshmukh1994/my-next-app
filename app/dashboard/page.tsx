import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Header from "@/app/componants/Header";
import Link from "next/link";
export default async function Dashboard() {
  //const supabase = await createClient();

  // const {
  //   data: { user },
  // } = await supabase.auth.getUser();
  // if (!user) {
  //   redirect("/login");
  // }

  // const userData = {
  //   name: user?.user_metadata?.full_name,
  //   email: user?.user_metadata?.email,
  //   id: user?.user_metadata?.id,
  // };

  return (
    <>
      <Header />
      <h1>Dashboard</h1>
      <Link href="/users">Users </Link>
    </>
  );
}
