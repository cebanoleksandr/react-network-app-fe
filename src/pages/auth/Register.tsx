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
import { useTranslation } from "react-i18next";
import { registerSchema, type RegisterFormData } from "./registerSchema";
import { AuthService } from "../../services/auth.service";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(registerSchema) as Resolver<RegisterFormData>,
    defaultValues: {
      username: "",
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const response = await AuthService.register({
        email: data.email,
        password: data.password,
        username: data.username,
        firstName: data.firstName,
        lastName: data.lastName,
      });

      localStorage.setItem('network-token', response.accessToken);
      navigate('/app');
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
              bgcolor: "success.main",
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
            {t("register.title")}
          </Typography>

          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ width: "100%" }}>
            
            {/* Поле Username */}
            <Controller
              name="username"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  margin="normal"
                  required
                  fullWidth
                  id="username"
                  label="Юзернейм"
                  autoComplete="username"
                  autoFocus
                  error={!!errors.username}
                  helperText={errors.username?.message}
                  slotProps={{
                    input: { sx: { borderRadius: "8px" } }
                  }}
                />
              )}
            />

            {/* Контейнер для Імені та Прізвища в один рядок для економії місця */}
            <Box sx={{ display: "flex", gap: 2 }}>
              <Controller
                name="firstName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    margin="normal"
                    required
                    fullWidth
                    id="firstName"
                    label="Ім'я"
                    autoComplete="given-name"
                    error={!!errors.firstName}
                    helperText={errors.firstName?.message}
                    slotProps={{
                      input: { sx: { borderRadius: "8px" } }
                    }}
                  />
                )}
              />

              <Controller
                name="lastName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    margin="normal"
                    required
                    fullWidth
                    id="lastName"
                    label="Прізвище"
                    autoComplete="family-name"
                    error={!!errors.lastName}
                    helperText={errors.lastName?.message}
                    slotProps={{
                      input: { sx: { borderRadius: "8px" } }
                    }}
                  />
                )}
              />
            </Box>

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
              color="success"
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
