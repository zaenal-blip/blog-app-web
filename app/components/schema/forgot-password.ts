import { z } from "zod";

export const forgotPasswordSchema = z.object({
    email: z.email({ error: "invalid emial address." })
});

export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;
