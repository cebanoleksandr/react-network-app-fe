import { useTranslation } from "react-i18next";

const Groups = () => {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t("pages.groups")}</h1>
    </div>
  );
};

export default Groups;
