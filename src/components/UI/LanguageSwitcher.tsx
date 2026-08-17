import { useTranslation } from 'react-i18next';
import { MenuItem } from '@mui/material';
import { SUPPORTED_LANGUAGES } from '../../constants/languages';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <>
      {SUPPORTED_LANGUAGES.map(({ code, label }) => (
        <MenuItem key={code} onClick={() => changeLanguage(code)}>
          {label}
        </MenuItem>
      ))}
    </>
  );
};

export default LanguageSwitcher;