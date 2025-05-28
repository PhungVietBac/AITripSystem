import LoginForm from "./loginForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login to your account",
  description: "This is the login page for users to access their accounts.",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <main className="flex-grow container mx-auto px-4 py-8">
        <LoginForm />
      </main>
    </div>
  );
}
