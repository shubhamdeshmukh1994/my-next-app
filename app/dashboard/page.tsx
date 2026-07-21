import Link from "next/link";
export default async function Dashboard() {

  return (
    <>
      <h1>Dashboard</h1>
      <Link href="/users">Users </Link>
    </>
  );
}
