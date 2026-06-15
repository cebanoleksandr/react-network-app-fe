import * as yup from "yup";

export const registerSchema = yup.object({
  username: yup
    .string()
    .required("Юзернейм є обов'язковим")
    .min(3, "Юзернейм має містити мінімум 3 символи")
    .matches(/^[a-zA-Z0-9_]+$/, "Тільки латиниця, цифри та підкреслення"),
  firstName: yup
    .string()
    .required("Ім'я є обов'язковим")
    .min(2, "Ім'я має містити мінімум 2 символи"),
  lastName: yup
    .string()
    .required("Прізвище є обов'язковим")
    .min(2, "Прізвище має містити мінімум 2 символи"),
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
