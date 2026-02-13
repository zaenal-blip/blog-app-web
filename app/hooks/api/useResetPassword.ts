import { useMutation } from "@tanstack/react-query";
import { Navigate, useNavigate } from "react-router";
import { toast } from "sonner";
import type { ResetPasswordSchema, resetPasswordSchema } from "~/components/schema/reset-password";
import { axiosInstance2 } from "~/lib/axios";
import type useForgotPassword from "./useForgotPassword";

const useResetPassword = () => {
    const navigate = useNavigate();
    return useMutation({
        mutationFn: async (payload: ResetPasswordSchema & { token: string }) => {
            const { data } = await axiosInstance2.post("/auth/reset-password", {
                password: payload.password,
            }, {
                headers: {
                    Authorization: `Bearer ${payload.token}`
                }
            })
            return data
        },
        onSuccess: () => {
            toast.success("password reset success")
            navigate("/login")
        },
        onError: () => {
            toast.error("error reset password")
        }
    })

};

export default useResetPassword;