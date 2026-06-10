import { useState } from "react";
import { 
  alpha, 
  Box, 
  InputAdornment, 
  SvgIcon, 
  TextField, 
  Avatar, 
  Menu, 
  MenuItem, 
  Button,
  Typography
} from "@mui/material";
import { Search as SearchIcon, KeyboardArrowDown as ArrowDownIcon } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import FaviconIcon from '../../assets/icons/gemini-svg.svg?react';

const Header = () => {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box
      component="header"
      sx={{
        backgroundColor: alpha("#4A76A8", 0.8),
        color: "white", 
        px: 2, 
        position: "sticky",
        top: 0, 
        zIndex: 1,
        backdropFilter: "blur(5px)", 
        height: "60px",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", maxWidth: "1200px", mx: "auto", height: "100%" }}>
        <Box sx={{ width: '200px' }}>
          <SvgIcon
            component={FaviconIcon}
            inheritViewBox
            sx={{ fontSize: "40px" }}
          />
        </Box>

        <Box sx={{ flexGrow: 1, mx: 2, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <TextField
            variant="outlined"
            size="small"
            placeholder={t("header.search")}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start" sx={{ color: alpha("#ffffff", 0.7) }}>
                    <SearchIcon />
                  </InputAdornment>
                ),
              },
            }}
            sx={{
              backgroundColor: alpha("#ffffff", 0.15),
              borderRadius: 99,
              "& .MuiOutlinedInput-input": {
                color: "white",
                paddingLeft: "4px",
              },
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "transparent",
                },
                "&:hover fieldset": {
                  borderColor: "transparent",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "transparent",
                },
              },
            }}
          />
        </Box>

        <Box>
          <Button
            onClick={handleMenuOpen}
            endIcon={<ArrowDownIcon />}
            sx={{ 
              color: "white", 
              textTransform: "none",
              gap: 1,
              borderRadius: 2,
              px: 1,
              "&:hover": {
                backgroundColor: alpha("#ffffff", 0.1),
              }
            }}
          >
            <Avatar 
              alt={t("header.user_avatar_alt")} 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
              sx={{ width: 32, height: 32 }}
            />
            <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' } }}>
              {t("header.default_user_name")}
            </Typography>
          </Button>

          <Menu
            anchorEl={anchorEl}
            open={isMenuOpen}
            onClose={handleMenuClose}
            onClick={handleMenuClose}
            slotProps={{
              paper: {
                elevation: 3,
                sx: {
                  mt: 1.5,
                  minWidth: 150,
                  overflow: 'visible',
                  '&::before': {
                    content: '""',
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: 'background.paper',
                    transform: 'translateY(-50%) rotate(45deg)',
                    zIndex: 0,
                  },
                },
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem onClick={handleMenuClose}>{t("header.my_profile")}</MenuItem>
            <MenuItem onClick={handleMenuClose}>{t("header.settings")}</MenuItem>
            <MenuItem onClick={handleMenuClose} sx={{ color: 'error.main' }}>
              {t("header.logout")}
            </MenuItem>
          </Menu>
        </Box>

      </Box>
    </Box>
  );
};

export default Header;
