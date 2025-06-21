import { z } from "zod";

const RegisterSchema = z.object({
    userName: z
        .string()
        .min(3, { message: "Username must be at least 3 characters long" })
        .max(20, { message: "Username must be at most 20 characters long" }),

    email: z.string().email({ message: "Invalid email address" }),

    password: z
        .string()
        .min(6, { message: "Password must be at least 6 characters long" })
        .max(16, { message: "Password must be at most 16 characters long" })
        .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/, {
            message:
                "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character.",
        }),

    avatar: z.string().optional(),
    fullName: z
        .string()
        .min(6, { message: "Full name must be at least 6 characters long" })
        .max(20, { message: "Full name must be at most 20 characters long" })
        .optional(),
});

const loginSchema = RegisterSchema.omit({
    userName: true,
    avatar: true,
    fullName: true,
});

const updatePasswordSchema = z.object({
    oldPassword: z
        .string()
        .min(6, { message: "Password must be at least 6 characters long" })
        .max(16, { message: "Password must be at most 16 characters long" })
        .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/, {
            message:
                "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character.",
        }),
    newPassword: z
        .string()
        .min(6, { message: "Password must be at least 6 characters long" })
        .max(16, { message: "Password must be at most 16 characters long" })
        .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/, {
            message:
                "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character.",
        }),
});

// types
type RegisterData = z.infer<typeof RegisterSchema>;
type LoginData = z.infer<typeof loginSchema>;
type UpdatePasswordData = z.infer<typeof updatePasswordSchema>;

const validateRegisterData = (data: RegisterData) => {
    return RegisterSchema.safeParse(data);
};

const validateLoginData = (data: LoginData) => {
    return loginSchema.safeParse(data);
};

const validateUpdatePasswordData = (data: UpdatePasswordData) => {
    return updatePasswordSchema.safeParse(data);
};

export { validateRegisterData, validateLoginData, validateUpdatePasswordData };
