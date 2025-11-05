import { SignupForm } from "@/components/auth/signup-form";
import { authStore } from "@/stores/authStore";
import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/register")({
  component: RouteComponent,
});

function RouteComponent() {
  const isAuthenticated = authStore((state) => state.isAuthenticated);

  // Se já está autenticado, redireciona
  if (isAuthenticated) {
    return <Navigate to="/tasks" />;
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <SignupForm />
      </div>
    </div>
  );
}
