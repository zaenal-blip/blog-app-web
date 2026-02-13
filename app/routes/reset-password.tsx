import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router";
import * as z from "zod";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Field, FieldError, FieldLabel } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { axiosInstance2 } from "~/lib/axios";
import { resetPasswordSchema, type ResetPasswordSchema } from "~/components/schema/reset-password";
import useResetPassword from "~/hooks/api/useResetPassword";
export default function ResetPassword() {
  const navigate = useNavigate();
  // If you use a token in the URL, get it here (e.g., /reset-password/:token)
  const { token } = useParams();
  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const { mutateAsync: resetPassword, isPending } = useResetPassword();

  async function onSubmit(data: z.infer<typeof resetPasswordSchema>) {
    if (!token) return;
    await resetPassword({ ...data, token });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Link to="/" className="text-2xl font-bold text-foreground mb-2">
            BlogApp
          </Link>
          <CardTitle className="text-xl">Reset Password</CardTitle>
          <CardDescription>Enter your new password below</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            id="form-reset-password"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            {/* Password */}
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-reset-password-password">
                    New Password
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-reset-password-password"
                    type="password"
                    aria-invalid={fieldState.invalid}
                    placeholder="••••••••"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            {/* Confirm Password */}
            <Controller
              name="confirmPassword"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-reset-password-confirm">
                    Confirm Password
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-reset-password-confirm"
                    type="password"
                    aria-invalid={fieldState.invalid}
                    placeholder="••••••••"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Button type="submit"
              form="form-reset-password"
              className="w-full"
              disabled={isPending}
            >
              {isPending ? "Loading..." : "Reset Password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
};