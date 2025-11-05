import { authStore } from "@/stores/authStore";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: ({ location }) => {
    const isAuthenticated = authStore.getState().isAuthenticated;

    if (!isAuthenticated) {
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href,
        },
      });
    }
  },
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  return <Outlet />;
}
