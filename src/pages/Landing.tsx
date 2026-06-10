import { useTranslation } from "react-i18next";

const Landing = () => {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t("landing.welcome")}</h1>
    </div>
  );
};

export default Landing;
