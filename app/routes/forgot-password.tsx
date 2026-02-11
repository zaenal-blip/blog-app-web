import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { forgotPasswordSchema, type ForgotPasswordSchema } from "~/components/schema/forgot-password";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Field, FieldError, FieldLabel } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import useForgotPassword from "~/hooks/api/useForgotPassword";

export default function ForgotPassword() {

  const form = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const { mutateAsync, isPending } = useForgotPassword();
  async function onSubmit(data: ForgotPasswordSchema) {
    await mutateAsync(data)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Link to="/" className="text-2xl font-bold text-foreground mb-2">
            BlogApp
          </Link>
          <CardTitle className="text-xl">Forgot password</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            id="form-forgot-password"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            {/* Email */}
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-email">Email</FieldLabel>
                  <Input
                    {...field}
                    id="form-email"
                    aria-invalid={fieldState.invalid}
                    placeholder="you@example.com"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              form="form-forgot-password"
              className="w-full"
              disabled={isPending}
            >
              {isPending ? "Loading..." : "Submit"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
