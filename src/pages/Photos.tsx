import { useTranslation } from "react-i18next";

const Photos = () => {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t("pages.photos")}</h1>
    </div>
  );
};

export default Photos;
