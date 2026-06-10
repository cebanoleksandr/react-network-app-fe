import * as yup from "yup";

export const loginSchema = yup.object({
  email: yup
    .string()
    .required("Електронна пошта є обов'язковим полем")
    .email("Введіть коректну пошту"),
  password: yup
    .string()
    .required("Пароль є обов'язковим полем")
    .min(6, "Мінімум 6 символів"),
});

export type LoginFormData = yup.InferType<typeof loginSchema>;