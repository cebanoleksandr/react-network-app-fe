import { useTranslation } from 'react-i18next';
import { MenuItem } from '@mui/material';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <>
      <MenuItem onClick={() => changeLanguage('uk')}>Українська</MenuItem>
      <MenuItem onClick={() => changeLanguage('en')}>English</MenuItem>
    </>
  );
};

export default LanguageSwitcher;