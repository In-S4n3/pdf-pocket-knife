import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <main className="min-h-screen flex justify-center items-center">
      <SignIn />
    </main>
  );
}
