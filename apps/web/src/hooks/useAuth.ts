import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { api, getErrorMessage } from "@/lib/api";
import { authStore } from "@/stores/authStore";
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
} from "@monorepo/types/src";

export const useAuth = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, login, logout } = authStore();

  // MUTATION: Login
  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginRequest) => {
      const response = await api.post<AuthResponse>("/auth/login", credentials);
      return response.data;
    },
    onSuccess: (data) => {
      // Atualiza store
      login(data.user, data.accessToken, data.refreshToken);

      // Feedback
      toast.success(`Bem-vindo de volta, ${data.user.username}!`);

      // Redireciona para tasks
      navigate({ to: "/tasks" });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  // MUTATION: Register
  const registerMutation = useMutation({
    mutationFn: async (data: RegisterRequest) => {
      const response = await api.post<AuthResponse>("/auth/register", data);
      return response.data;
    },
    onSuccess: (data) => {
      // Atualiza store
      login(data.user, data.accessToken, data.refreshToken);

      // Feedback
      toast.success(
        `Conta criada com sucesso! Bem-vindo, ${data.user.username}!`
      );

      // Redireciona para tasks
      navigate({ to: "/tasks" });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  // LOGOUT
  const handleLogout = async () => {
    try {
      // Chama endpoint de logout (invalida refresh token)
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    } finally {
      // Sempre limpa store e redireciona
      logout();
      toast.info("Você saiu da sua conta");
      navigate({ to: "/login" });
    }
  };

  return {
    // Estado
    user,
    isAuthenticated,

    // Mutations
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout: handleLogout,

    // Loading states
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
  };
};
