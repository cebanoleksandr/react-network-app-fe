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
} from "@mui/material";
import { Visibility, VisibilityOff, LockOutlined as LockOutlinedIcon } from "@mui/icons-material";
import { loginSchema, type LoginFormData } from "./loginSchema";
import { AuthService } from "../../services/auth.service";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const { 
    control, 
    handleSubmit, 
    formState: { errors, isSubmitting } 
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema) as Resolver<LoginFormData>,
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await AuthService.login({
        email: data.email,
        password: data.password,
      });
      
      localStorage.setItem('network-token', response.accessToken);
      navigate('/app');
    } catch (error) {
      console.error(error);
    }
  };

  const handleClickShowPassword = () => setShowPassword((prev) => !prev);

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box sx={{ marginTop: 8, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Paper
          elevation={3}
          sx={{ p: 4, display: "flex", flexDirection: "column", alignItems: "center", borderRadius: "12px", width: "100%" }}
        >
          <Box
            sx={{
              m: 1,
              bgcolor: "primary.main",
              color: "white",
              borderRadius: "50%",
              width: 40,
              height: 40,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <LockOutlinedIcon />
          </Box>

          <Typography component="h1" variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
            Вхід до акаунту
          </Typography>

          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ width: "100%" }}>
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
                  autoComplete="current-password"
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

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isSubmitting}
              sx={{ mt: 3, mb: 2, py: 1.2, borderRadius: "8px", textTransform: "none", fontSize: "16px", fontWeight: 600 }}
            >
              {isSubmitting ? "Вхід..." : "Увійти"}
            </Button>

            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
              <Link href="/auth/reset-password" variant="body2" sx={{ underline: "none", color: "text.secondary" }}>
                Забули пароль?
              </Link>
              <Link href="/auth/register" variant="body2" sx={{ underline: "none", fontWeight: 500 }}>
                Реєстрація
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default LoginPage;
