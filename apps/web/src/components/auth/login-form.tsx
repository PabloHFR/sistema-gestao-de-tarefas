import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useForm } from "react-hook-form";
import { loginSchema, type LoginFormData } from "@/schemas/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { login, isLoggingIn } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginFormData) => {
    login(data);
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Entre na sua conta</CardTitle>
          <CardDescription>
            Insira seu email ou nome de usuário abaixo para entrar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="identifier">
                  Email ou Nome de Usuário
                </FieldLabel>
                <Input
                  id="identifier"
                  type="text"
                  placeholder="joao@example.com ou joaosilva"
                  required
                  disabled={isLoggingIn}
                  {...register("identifier")}
                />
                {errors.identifier && (
                  <p className="text-sm text-destructive">
                    {errors.identifier.message}
                  </p>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="password">Senha</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  disabled={isLoggingIn}
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-sm text-destructive">
                    {errors.password.message}
                  </p>
                )}
              </Field>
              <Field>
                <Button type="submit" disabled={isLoggingIn}>
                  {isLoggingIn && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {isLoggingIn ? "Entrando..." : "Entrar"}
                </Button>
                <FieldDescription className="text-center">
                  Não tem uma conta? <a href="/register">Registre-se</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
