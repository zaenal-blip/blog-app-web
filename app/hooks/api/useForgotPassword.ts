import { useMutation } from "@tanstack/react-query";
import { Navigate, useNavigate } from "react-router";
import { toast } from "sonner";
import type { ForgotPasswordSchema } from "~/components/schema/forgot-password";
import { axiosInstance } from "~/lib/axios";

const useForgotPassword = () => {
    const navigate = useNavigate();
    return useMutation({
        mutationFn: async (payload: ForgotPasswordSchema) => {
            const { data } = await axiosInstance.post("/auth/forgot-password", {
                email: payload.email
            })
            return data
        },
        onSuccess: () => {
            toast.success("send email success")
            navigate("/")
        },
        onError: () => {
            toast.error("error forgot password")
        }
    })

};

export default useForgotPassword;