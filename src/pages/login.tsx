import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth, useSignIn } from "@/features/auth";
import { ROUTES } from "@/lib/constants/routes";
import { onError } from "@/lib/errors";
import { loginSchema, type LoginInput } from "@/validation";
import { LoadingButton } from "@/components/ui/loading-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const { isAuthenticated } = useAuth();
  const signIn = useSignIn();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname;

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  if (isAuthenticated) {
    return <Navigate to={from ?? ROUTES.DASHBOARD.ROOT} replace />;
  }

  const onSubmit = (values: LoginInput) => {
    // Placeholder: signs in locally. Swap for a real auth mutation.
    signIn.mutate(values.email, {
      onSuccess: () => navigate(from ?? ROUTES.DASHBOARD.ROOT, { replace: true }),
      onError,
    });
  };

  return (
    <div className="flex justify-center py-8">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
          <CardDescription>
            Placeholder auth — any valid email and an 8+ character password works.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <Field data-invalid={form.formState.errors.email ? "" : undefined}>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                {...form.register("email")}
              />
              <FieldError
                errors={form.formState.errors.email ? [form.formState.errors.email] : []}
              />
            </Field>

            <Field data-invalid={form.formState.errors.password ? "" : undefined}>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                {...form.register("password")}
              />
              <FieldError
                errors={form.formState.errors.password ? [form.formState.errors.password] : []}
              />
            </Field>

            <LoadingButton
              type="submit"
              className="w-full"
              isLoading={signIn.isPending}
              loadingText="Signing in..."
            >
              Sign in
            </LoadingButton>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
