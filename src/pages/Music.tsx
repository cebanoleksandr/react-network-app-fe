import { useTranslation } from "react-i18next";

const Music = () => {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t("pages.music")}</h1>
    </div>
  );
};

export default Music;
