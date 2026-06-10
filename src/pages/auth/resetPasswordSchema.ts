import * as yup from "yup";

export const resetPasswordSchema = yup.object({
  email: yup
    .string()
    .required("Електронна пошта є обов'язковою")
    .email("Введіть коректну електронну пошту"),
});

export type ResetPasswordFormData = yup.InferType<typeof resetPasswordSchema>;
