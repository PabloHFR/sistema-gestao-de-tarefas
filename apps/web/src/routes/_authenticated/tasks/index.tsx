import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/tasks/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { logout } = useAuth();
  return (
    <div className="flex min-h-svh flex-col items-center justify-center">
      <Button onClick={logout}>Sair da conta!</Button>
    </div>
  );
}
