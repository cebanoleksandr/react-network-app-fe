import { Box, Button, Container, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Link as RouterLink } from "react-router-dom";

const NotFound = () => {
  const { t } = useTranslation();

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        <Typography
          sx={{
            fontWeight: 800,
            fontSize: { xs: "5rem", md: "7rem" },
            lineHeight: 1,
            color: "primary.main",
          }}
        >
          {t("pages.not_found.title")}
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 600, mt: 2, mb: 1 }}>
          {t("pages.not_found.subtitle")}
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 4 }}>
          {t("pages.not_found.description")}
        </Typography>
        <Button
          component={RouterLink}
          to="/"
          variant="contained"
          sx={{ textTransform: "none", borderRadius: "8px", py: 1.2, px: 4, fontWeight: 600 }}
        >
          {t("pages.not_found.back_home")}
        </Button>
      </Box>
    </Container>
  );
};

export default NotFound;
