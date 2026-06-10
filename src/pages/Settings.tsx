import { useTranslation } from "react-i18next";

const Settings = () => {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t("pages.settings")}</h1>
    </div>
  );
};

export default Settings;
