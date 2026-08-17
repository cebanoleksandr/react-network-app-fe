import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Box,
  Button,
  Card,
  CircularProgress,
  Container,
  IconButton,
  MenuItem,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { UsersService } from "../services/users.service";
import { MediaService } from "../services/mediaService";
import { AuthService } from "../services/auth.service";
import { setUserAC } from "../store/userSlice";
import { setAlertAC } from "../store/alertSlice";
import { setThemeModeAC } from "../store/themeSlice";
import { SUPPORTED_LANGUAGES } from "../constants/languages";
import LogoutPopup from "../components/popups/LogoutPopup";
import DeleteAvaPopup from "../components/popups/DeleteAvaPopup";

const SettingsCard = styled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: "12px",
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: "0 1px 2px 0 rgba(0,0,0,0.05)",
  padding: 24,
}));

const Settings = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { item: currentUser } = useAppSelector((state) => state.user);
  const themeMode = useAppSelector((state) => state.theme.mode);

  const [profileForm, setProfileForm] = useState({
    firstName: currentUser?.firstName || "",
    lastName: currentUser?.lastName || "",
    bio: currentUser?.bio || "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [isLogoutPopupOpen, setIsLogoutPopupOpen] = useState(false);
  const [isDeleteAvaPopupOpen, setIsDeleteAvaPopupOpen] = useState(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const updatedUser = await UsersService.updateProfile(profileForm);
      dispatch(setUserAC(updatedUser));
      dispatch(setAlertAC({ text: t("alerts.profile_updated_success"), mode: "success" }));
    } catch (error) {
      console.error("Error updating profile:", error);
      dispatch(setAlertAC({ text: t("alerts.profile_updated_error"), mode: "error" }));
    } finally {
      setIsSaving(false);
    }
  };

  const handleUploadClick = () => {
    if (!avatarLoading) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setAvatarLoading(true);

      const { uploadUrl, path } = await MediaService.getUploadUrl(file.name, file.type);
      await MediaService.uploadToStorage(uploadUrl, file);

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const generatedAvatarUrl = `https://${supabaseUrl}.supabase.co/storage/v1/object/public/network/${path}`;

      const updatedUser = await UsersService.updateProfile({ avatarUrl: generatedAvatarUrl });
      dispatch(setUserAC(updatedUser));
      dispatch(setAlertAC({ text: t("alerts.avatar_updated_success"), mode: "success" }));
    } catch (error) {
      console.error("Error updating avatar:", error);
      dispatch(setAlertAC({ text: t("alerts.avatar_updated_error"), mode: "error" }));
    } finally {
      setAvatarLoading(false);
      event.target.value = "";
    }
  };

  const handleDeleteAvatar = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      setAvatarLoading(true);
      const updatedUser = await UsersService.updateProfile({ avatarUrl: "" });
      dispatch(setUserAC(updatedUser));
      dispatch(setAlertAC({ text: t("alerts.avatar_deleted_success"), mode: "success" }));
    } catch (error) {
      console.error("Error deleting avatar:", error);
      dispatch(setAlertAC({ text: t("alerts.avatar_deleted_error"), mode: "error" }));
    } finally {
      setAvatarLoading(false);
      setIsDeleteAvaPopupOpen(false);
    }
  };

  const handleLanguageChange = (e: ChangeEvent<HTMLInputElement>) => {
    i18n.changeLanguage(e.target.value);
  };

  const handleThemeChange = (_: React.MouseEvent<HTMLElement>, value: "light" | "dark" | null) => {
    if (value) {
      dispatch(setThemeModeAC(value));
    }
  };

  const handleLogout = async () => {
    try {
      await AuthService.logout();
    } catch (error) {
      console.error("Error logging out:", error);
    } finally {
      localStorage.removeItem("network-token");
      navigate("/auth/login");
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        height: "100%",
        overflowY: "auto",
        py: 3,
        "&::-webkit-scrollbar": {
          width: "6px",
        },
        "&::-webkit-scrollbar-track": {
          backgroundColor: "transparent",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "rgba(0, 0, 0, 0.15)",
          borderRadius: "10px",
          "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.25)",
          },
        },
        scrollbarWidth: "thin",
        scrollbarColor: "rgba(0, 0, 0, 0.15) transparent",
      }}
    >
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
        {t("settings.title")}
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <SettingsCard>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
            {t("settings.profile.title")}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {t("settings.profile.description")}
          </Typography>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            style={{ display: "none" }}
          />

          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
            <Box sx={{ position: "relative" }}>
              <Avatar src={currentUser?.avatarUrl || undefined} sx={{ width: 72, height: 72 }} />
              {avatarLoading && (
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "50%",
                    backgroundColor: "rgba(255,255,255,0.7)",
                  }}
                >
                  <CircularProgress size={24} />
                </Box>
              )}
            </Box>

            <Box sx={{ display: "flex", gap: 1 }}>
              <IconButton onClick={handleUploadClick} disabled={avatarLoading} title={t("settings.profile.avatar_upload")}>
                <CloudUploadIcon />
              </IconButton>
              {currentUser?.avatarUrl && (
                <IconButton
                  onClick={() => setIsDeleteAvaPopupOpen(true)}
                  disabled={avatarLoading}
                  color="error"
                  title={t("settings.profile.avatar_delete")}
                >
                  <DeleteIcon />
                </IconButton>
              )}
            </Box>
          </Box>

          <Box component="form" onSubmit={handleSaveProfile} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label={t("settings.profile.first_name")}
              name="firstName"
              fullWidth
              size="small"
              value={profileForm.firstName}
              onChange={handleInputChange}
            />
            <TextField
              label={t("settings.profile.last_name")}
              name="lastName"
              fullWidth
              size="small"
              value={profileForm.lastName}
              onChange={handleInputChange}
            />
            <TextField
              label={t("settings.profile.bio")}
              name="bio"
              fullWidth
              multiline
              rows={3}
              size="small"
              value={profileForm.bio}
              onChange={handleInputChange}
            />

            <Box>
              <Button
                type="submit"
                variant="contained"
                disabled={isSaving}
                sx={{ textTransform: "none", borderRadius: "8px", fontWeight: 600 }}
              >
                {isSaving ? <CircularProgress size={20} color="inherit" /> : t("settings.profile.save")}
              </Button>
            </Box>
          </Box>
        </SettingsCard>

        <SettingsCard>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
            {t("settings.language.title")}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {t("settings.language.description")}
          </Typography>

          <TextField
            select
            fullWidth
            size="small"
            value={i18n.language.split("-")[0]}
            onChange={handleLanguageChange}
          >
            {SUPPORTED_LANGUAGES.map(({ code, label }) => (
              <MenuItem key={code} value={code}>
                {label}
              </MenuItem>
            ))}
          </TextField>
        </SettingsCard>

        <SettingsCard>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
            {t("settings.appearance.title")}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {t("settings.appearance.description")}
          </Typography>

          <ToggleButtonGroup
            exclusive
            value={themeMode}
            onChange={handleThemeChange}
            sx={{ width: "100%" }}
          >
            <ToggleButton value="light" sx={{ flex: 1, textTransform: "none", gap: 1 }}>
              <LightModeOutlinedIcon fontSize="small" />
              {t("settings.appearance.light")}
            </ToggleButton>
            <ToggleButton value="dark" sx={{ flex: 1, textTransform: "none", gap: 1 }}>
              <DarkModeOutlinedIcon fontSize="small" />
              {t("settings.appearance.dark")}
            </ToggleButton>
          </ToggleButtonGroup>
        </SettingsCard>

        <SettingsCard>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
            {t("settings.account.title")}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {t("settings.account.description")}
          </Typography>

          <Button
            variant="outlined"
            color="error"
            onClick={() => setIsLogoutPopupOpen(true)}
            sx={{ textTransform: "none", borderRadius: "8px", fontWeight: 600 }}
          >
            {t("settings.account.logout")}
          </Button>
        </SettingsCard>
      </Box>

      <LogoutPopup
        isVisible={isLogoutPopupOpen}
        onClose={() => setIsLogoutPopupOpen(false)}
        onLogout={handleLogout}
      />

      <DeleteAvaPopup
        isVisible={isDeleteAvaPopupOpen}
        onClose={() => setIsDeleteAvaPopupOpen(false)}
        onDelete={handleDeleteAvatar}
      />
    </Container>
  );
};

export default Settings;
