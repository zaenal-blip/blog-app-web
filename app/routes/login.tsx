import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Link, redirect, useNavigate } from "react-router";
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
import { axiosInstance, axiosInstance2 } from "~/lib/axios";
import { useAuth } from "~/stores/useAuth";
import { useGoogleLogin } from "@react-oauth/google";

const formSchema = z.object({
  email: z.email({ error: "Invalid email address." }),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

export const clientLoader = () => {
  const user = useAuth.getState().user;
  if (user) return redirect("/");
};

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      const response = await axiosInstance2.post("/auth/login", {
        email: data.email,
        password: data.password,
      });
      
      login({...response.data});

      navigate("/");
    } catch (error) {
      alert("Error login");
    }
  }

  const handleLogin = useGoogleLogin({
    onSuccess:async ({access_token}) => {
      try {
        const response = await axiosInstance2.post("/auth/google", {
          accessToken: access_token,
        });
        login({...response.data});
        navigate("/");
      } catch (error) {
        alert("Error login with Google");
      }
    },
    onError: (error) => {
      console.log('Login Failed:', error);
    }
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Link to="/" className="text-2xl font-bold text-foreground mb-2">
            BlogApp
          </Link>
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            id="form-login"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            {/* Email */}
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-login-email">Email</FieldLabel>
                  <Input
                    {...field}
                    id="form-login-email"
                    aria-invalid={fieldState.invalid}
                    placeholder="you@example.com"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Password */}
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-login-password">
                    Password
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-login-password"
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

            {/* Submit Button */}
            <Button type="submit" form="form-login" className="w-full">
              Login
            </Button>

            <Button type="button"
             variant="secondary"
             className="w-full" 
             onClick={() => handleLogin()}>
              Google login
            </Button>

          </form>
        </CardContent>
        <CardFooter className="justify-center">
        
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-primary hover:underline font-medium"
            >
              Register
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}