import { useState } from "react";
import { useForm, Controller, type Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  CssBaseline,
  Paper,
  Link,
} from "@mui/material";
import { 
  LockResetOutlined as LockResetOutlinedIcon, 
  MarkEmailReadOutlined as MarkEmailReadOutlinedIcon 
} from "@mui/icons-material";
import { resetPasswordSchema, type ResetPasswordFormData } from "./resetPasswordSchema";

const ResetPassword = () => {
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: yupResolver(resetPasswordSchema) as Resolver<ResetPasswordFormData>,
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      console.log("Запит на скидання пароля для:", data.email);
      // Імітація відправки листа сервером
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setIsSuccess(true);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box sx={{ marginTop: 8, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Paper
          elevation={3}
          sx={{ p: 4, display: "flex", flexDirection: "column", alignItems: "center", borderRadius: "12px", width: "100%" }}
        >
          {/* Умовний рендеринг: якщо лист успішно надіслано */}
          {isSuccess ? (
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
              <Box
                sx={{
                  m: 1,
                  bgcolor: "info.main",
                  color: "white",
                  borderRadius: "50%",
                  width: 50,
                  height: 50,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  mb: 2
                }}
              >
                <MarkEmailReadOutlinedIcon fontSize="large" />
              </Box>
              
              <Typography component="h1" variant="h5" sx={{ mb: 1, fontWeight: 600 }}>
                Лист надіслано!
              </Typography>
              
              <Typography variant="body2" sx={{ color: "text.secondary", mb: 3 }}>
                Ми відправили інструкції для відновлення пароля на вашу електронну адресу. Будь ласка, перевірте пошту.
              </Typography>

              <Link href="/auth/login" variant="body2" sx={{ underline: "none", fontWeight: 600 }}>
                Повернутися до входу
              </Link>
            </Box>
          ) : (
            /* Стандартний стан форми запиту */
            <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ width: "100%" }}>
              <Box
                sx={{
                  m: 1,
                  bgcolor: "warning.main", // Помаранчевий колір попередження/відновлення
                  color: "white",
                  borderRadius: "50%",
                  width: 40,
                  height: 40,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  mx: "auto",
                  mb: 2
                }}
              >
                <LockResetOutlinedIcon />
              </Box>

              <Typography component="h1" variant="h5" sx={{ mb: 1, fontWeight: 600, textAlign: "center" }}>
                Відновлення пароля
              </Typography>

              <Typography variant="body2" sx={{ color: "text.secondary", mb: 3, textAlign: "center" }}>
                Введіть вашу електронну пошту, і ми надішлемо вам посилання для зміни пароля.
              </Typography>

              {/* Поле Email */}
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Електронна пошта"
                    autoComplete="email"
                    autoFocus
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    slotProps={{
                      input: { sx: { borderRadius: "8px" } }
                    }}
                  />
                )}
              />

              {/* Кнопка відправки */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="warning"
                disabled={isSubmitting}
                sx={{ mt: 3, mb: 2, py: 1.2, borderRadius: "8px", textTransform: "none", fontSize: "16px", fontWeight: 600 }}
              >
                {isSubmitting ? "Надсилання..." : "Надіслати посилання"}
              </Button>

              {/* Посилання назад на логін */}
              <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
                <Link href="#" variant="body2" sx={{ underline: "none", fontWeight: 500, color: "text.secondary" }}>
                  Згадали пароль? <Box component="span" sx={{ color: "warning.main", fontWeight: 600 }}>Увійти</Box>
                </Link>
              </Box>
            </Box>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default ResetPassword;
