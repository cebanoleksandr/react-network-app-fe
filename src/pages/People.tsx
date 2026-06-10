import { useTranslation } from "react-i18next";

const People = () => {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t("pages.people")}</h1>
    </div>
  );
};

export default People;
