import { Box, Button, Container, Typography, Paper } from "@mui/material";
import { Groups2Outlined, ChatBubbleOutlineRounded, DynamicFeedOutlined } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { Link as RouterLink } from "react-router-dom";
import heroImage from "../assets/hero.png";

const features = [
  { key: "feed", icon: DynamicFeedOutlined },
  { key: "chat", icon: ChatBubbleOutlineRounded },
  { key: "groups", icon: Groups2Outlined },
] as const;

const Landing = () => {
  const { t } = useTranslation();
  const isAuthorized = !!localStorage.getItem("network-token");

  return (
    <Box>
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            py: 3,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700, color: "primary.main" }}>
            Network
          </Typography>
          {!isAuthorized && (
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button component={RouterLink} to="/auth/login" color="inherit" sx={{ textTransform: "none" }}>
                {t("landing.nav.login")}
              </Button>
              <Button
                component={RouterLink}
                to="/auth/register"
                variant="contained"
                sx={{ textTransform: "none", borderRadius: "8px" }}
              >
                {t("landing.nav.register")}
              </Button>
            </Box>
          )}
        </Box>
      </Container>

      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "center",
            gap: 6,
            py: { xs: 6, md: 10 },
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 800,
                fontSize: { xs: "2.25rem", md: "3rem" },
                lineHeight: 1.15,
                mb: 2,
              }}
            >
              {t("landing.hero.title")}
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400, mb: 4 }}>
              {t("landing.hero.subtitle")}
            </Typography>
            <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2 }}>
              <Button
                component={RouterLink}
                to="/auth/register"
                variant="contained"
                size="large"
                sx={{ textTransform: "none", borderRadius: "8px", py: 1.5, px: 4, fontWeight: 600 }}
              >
                {t("landing.hero.cta_primary")}
              </Button>
              <Button
                component={RouterLink}
                to="/auth/login"
                variant="outlined"
                size="large"
                sx={{ textTransform: "none", borderRadius: "8px", py: 1.5, px: 4, fontWeight: 600 }}
              >
                {t("landing.hero.cta_secondary")}
              </Button>
            </Box>
          </Box>

          <Box sx={{ flex: 1, display: "flex", justifyContent: "center" }}>
            <Box
              component="img"
              src={heroImage}
              alt=""
              sx={{ width: "100%", maxWidth: 420 }}
            />
          </Box>
        </Box>
      </Container>

      <Container maxWidth="lg" sx={{ pb: { xs: 8, md: 12 } }}>
        <Typography
          variant="h4"
          sx={{ fontWeight: 700, mb: 6, textAlign: "center" }}
        >
          {t("landing.features.title")}
        </Typography>

        <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 3 }}>
          {features.map(({ key, icon: Icon }) => (
            <Paper
              key={key}
              elevation={0}
              sx={{
                flex: 1,
                p: 4,
                borderRadius: "16px",
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: "12px",
                  bgcolor: "primary.main",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 2,
                }}
              >
                <Icon />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                {t(`landing.features.${key}.title`)}
              </Typography>
              <Typography color="text.secondary">
                {t(`landing.features.${key}.description`)}
              </Typography>
            </Paper>
          ))}
        </Box>
      </Container>

      <Box component="footer" sx={{ borderTop: "1px solid", borderColor: "divider", py: 3 }}>
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center" }}>
            © {new Date().getFullYear()} Network. {t("landing.footer.rights")}
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Landing;
