import { useTranslation } from "react-i18next";

const Games = () => {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t("pages.games")}</h1>
    </div>
  );
};

export default Games;
