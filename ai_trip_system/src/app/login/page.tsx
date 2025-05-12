import LoginForm from "./loginForm";

export default function LoginPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center">
            <main className="flex-grow container mx-auto px-4 py-8">
                <LoginForm />
            </main>
        </div>
    );
}