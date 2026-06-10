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
  IconButton,
  InputAdornment,
  Paper,
  Link,
  Checkbox,
  FormControlLabel,
  FormHelperText,
} from "@mui/material";
import { Visibility, VisibilityOff, PersonAddOutlined as PersonAddOutlinedIcon } from "@mui/icons-material";
import { registerSchema, type RegisterFormData } from "./registerSchema";

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(registerSchema) as Resolver<RegisterFormData>,
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      console.log("Валідні дані реєстрації:", data);
      // Імітація запиту на бекенд (наприклад, реєстрація користувача)
      await new Promise((resolve) => setTimeout(resolve, 1500));
    } catch (error) {
      console.error(error);
    }
  };

  const handleClickShowPassword = () => setShowPassword((prev) => !prev);
  const handleClickShowConfirmPassword = () => setShowConfirmPassword((prev) => !prev);

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box sx={{ marginTop: 4, marginBottom: 4, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Paper
          elevation={3}
          sx={{ p: 4, display: "flex", flexDirection: "column", alignItems: "center", borderRadius: "12px", width: "100%" }}
        >
          {/* Іконка реєстрації (чоловічок із плюсом) */}
          <Box
            sx={{
              m: 1,
              bgcolor: "success.main", // Зелений колір акценту для реєстрації
              color: "white",
              borderRadius: "50%",
              width: 40,
              height: 40,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <PersonAddOutlinedIcon />
          </Box>

          <Typography component="h1" variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
            Створення акаунту
          </Typography>

          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ width: "100%" }}>
            
            {/* Поле Повне Ім'я */}
            <Controller
              name="fullName"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  margin="normal"
                  required
                  fullWidth
                  id="fullName"
                  label="Ім'я та прізвище"
                  autoComplete="name"
                  autoFocus
                  error={!!errors.fullName}
                  helperText={errors.fullName?.message}
                  slotProps={{
                    input: { sx: { borderRadius: "8px" } }
                  }}
                />
              )}
            />

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
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  slotProps={{
                    input: { sx: { borderRadius: "8px" } }
                  }}
                />
              )}
            />

            {/* Поле Пароль */}
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  margin="normal"
                  required
                  fullWidth
                  label="Пароль"
                  type={showPassword ? "text" : "password"}
                  id="password"
                  autoComplete="new-password"
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  slotProps={{
                    input: {
                      sx: { borderRadius: "8px" },
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={handleClickShowPassword} edge="end">
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      )
                    }
                  }}
                />
              )}
            />

            {/* Поле Підтвердження Пароля */}
            <Controller
              name="confirmPassword"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  margin="normal"
                  required
                  fullWidth
                  label="Підтвердіть пароль"
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  autoComplete="new-password"
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword?.message}
                  slotProps={{
                    input: {
                      sx: { borderRadius: "8px" },
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={handleClickShowConfirmPassword} edge="end">
                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      )
                    }
                  }}
                />
              )}
            />

            {/* Чекбокс згоди з правилами */}
            <Box sx={{ mt: 1 }}>
              <Controller
                name="acceptTerms"
                control={control}
                render={({ field: { value, onChange, ...field } }) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        {...field}
                        checked={value}
                        onChange={(e) => onChange(e.target.checked)}
                        color="primary"
                      />
                    }
                    label={
                      <Typography sx={{ fontSize: 14 }}>
                        Я згоден з {" "}
                        <Link href="#" sx={{ underline: "none" }}>
                          умовами використання
                        </Link>
                      </Typography>
                    }
                  />
                )}
              />
              {/* Виведення помилки для чекбокса */}
              {errors.acceptTerms && (
                <FormHelperText error sx={{ ml: 2 }}>
                  {errors.acceptTerms.message}
                </FormHelperText>
              )}
            </Box>

            {/* Кнопка реєстрації */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="success" // Зелена кнопка для гармонії з іконкою
              disabled={isSubmitting}
              sx={{ mt: 3, mb: 2, py: 1.2, borderRadius: "8px", textTransform: "none", fontSize: "16px", fontWeight: 600 }}
            >
              {isSubmitting ? "Реєстрація..." : "Зареєструватися"}
            </Button>

            {/* Посилання на вхід */}
            <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Вже маєте акаунт?{" "}
                <Link href="/auth/login" sx={{ underline: "none", fontWeight: 600, color: "success.main" }}>
                  Увійти
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default RegisterPage;
