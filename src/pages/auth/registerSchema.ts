import * as yup from "yup";

export const registerSchema = yup.object({
  fullName: yup
    .string()
    .required("Ім'я та прізвище є обов'язковими")
    .min(3, "Ім'я має містити мінімум 3 символи"),
  email: yup
    .string()
    .required("Електронна пошта є обов'язковою")
    .email("Введіть коректну електронну пошту"),
  password: yup
    .string()
    .required("Пароль є обов'язковим")
    .min(6, "Пароль має містити мінімум 6 символів"),
  confirmPassword: yup
    .string()
    .required("Підтвердження пароля є обов'язковим")
    .oneOf([yup.ref("password")], "Паролі не збігаються"),
  acceptTerms: yup
    .boolean()
    .required()
    .oneOf([true], "Ви маєте погодитися з умовами використання"),
});

export type RegisterFormData = yup.InferType<typeof registerSchema>;
