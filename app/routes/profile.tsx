import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Link, redirect } from "react-router";
import * as z from "zod";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Field, FieldError, FieldLabel } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { axiosInstance } from "~/lib/axios";
import { useAuth } from "~/stores/useAuth";
import useForgotPassword from "~/hooks/api/useForgotPassword";

const formSchema = z.object({
  photo: z.instanceof(File).refine(
    (file) => file.size <= 2 * 1024 * 1024, // 2MB
    "File size must be less than 2MB"
  ).refine(
    (file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type),
    "Only JPEG, PNG, and WebP images are allowed"
  ),
});

export const clientLoader = () => {
  const user = useAuth.getState().user;
  if (!user) return redirect("/login");
  return { user };
};

export default function Profile() {
  const { user, updateUser } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const { mutateAsync: forgotPassword, isPending: isForgotPending } = useForgotPassword();

  const handleResetPassword = async () => {
    if (user?.email) {
      await forgotPassword({ email: user.email });
    }
  };

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      const formData = new FormData();
      formData.append("photo", data.photo);

      await axiosInstance.post("/users/photo", formData)

      // Fetch updated user data
      const response = await axiosInstance.get(`/users/${user?.id}`);

      // Update user in store
      updateUser(response.data);

      alert("Photo uploaded successfully!");
    } catch (error) {
      alert("Error uploading photo");
    }
  }

  if (!user) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Link to="/" className="text-2xl font-bold text-foreground mb-2">
            BlogApp
          </Link>
          <CardTitle className="text-xl">Profile</CardTitle>
          <CardDescription>Update your profile photo</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current Profile Info */}
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden bg-gray-200">
              {user.image ? (
                <img
                  src={user.image}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  No Image
                </div>
              )}
            </div>
            <h3 className="text-lg font-semibold">{user.name}</h3>
            <p className="text-muted-foreground">{user.email}</p>
          </div>

          {/* Upload Form */}
          <form
            id="form-upload-photo"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <Controller
              name="photo"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-upload-photo">Upload Photo</FieldLabel>
                  <Input
                    id="form-upload-photo"
                    type="file"
                    accept="image/*"
                    aria-invalid={fieldState.invalid}
                    className="cursor-pointer"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) field.onChange(file);
                    }}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Button type="submit" form="form-upload-photo" className="w-full">
              Upload Photo
            </Button>
          </form>

          <div className="pt-4 border-t">
            <Button
              variant="outline"
              className="w-full text-destructive hover:bg-destructive hover:text-destructive-foreground"
              onClick={handleResetPassword}
              disabled={isForgotPending}
            >
              {isForgotPending ? "Sending..." : "Reset Password"}
            </Button>
            <p className="text-xs text-center text-muted-foreground mt-2">
              A password reset link will be sent to your email.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
