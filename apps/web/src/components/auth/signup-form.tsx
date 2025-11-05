import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { registerSchema, type RegisterFormData } from "@/schemas/validation";
import { Loader2 } from "lucide-react";

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
  const { register: registerUser, isRegistering } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: RegisterFormData) => {
    console.log(data);
    registerUser(data);
  };

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Criar conta</CardTitle>
        <CardDescription>
          Insira suas informações abaixo para criar uma conta
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="username">Nome de Usuário</FieldLabel>
              <Input
                id="username"
                type="text"
                placeholder="joaosilva"
                required
                {...register("username")}
                disabled={isRegistering}
              />
              {errors.username && (
                <p className="text-sm text-destructive">
                  {errors.username.message}
                </p>
              )}
            </Field>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="m@exemplo.com"
                required
                disabled={isRegistering}
                {...register("email")}
              />
              {errors.email && (
                <p className="text-sm text-destructive">
                  {errors.email.message}
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
                disabled={isRegistering}
                {...register("password")}
              />
              {errors.password && (
                <p className="text-sm text-destructive">
                  {errors.password.message}
                </p>
              )}
              <FieldDescription>
                Sua senha deve ter pelo menos 6 caracteres.
              </FieldDescription>
            </Field>
            <FieldGroup>
              <Field>
                <Button type="submit" disabled={isRegistering}>
                  {isRegistering && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {isRegistering ? "Criando conta..." : "Criar Conta"}
                </Button>
                <FieldDescription className="px-6 text-center">
                  Já possui uma conta? <a href="/login">Entrar</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
