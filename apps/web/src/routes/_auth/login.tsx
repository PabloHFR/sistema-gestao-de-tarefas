import { createFileRoute, Navigate } from "@tanstack/react-router";
import { authStore } from "@/stores/authStore";
import { LoginForm } from "@/components/auth/login-form";

export const Route = createFileRoute("/_auth/login")({
  component: LoginPage,
});

function LoginPage() {
  const isAuthenticated = authStore((state) => state.isAuthenticated);

  // Se já está autenticado, redireciona
  if (isAuthenticated) {
    return <Navigate to="/tasks" />;
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
}
