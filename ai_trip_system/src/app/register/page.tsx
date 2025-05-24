import RegisterForm from "./registerForm";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Register for an account',
  description: 'This is the registration page for new users to create an account.',
};
  

export default function RegisterPage() {
  return (
    <div className="flex flex-col w-full items-center justify-center min-h-screen py-2">
      <RegisterForm />
    </div>
  );
}