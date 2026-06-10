import { useTranslation } from "react-i18next";

const Dialogs = () => {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t("pages.dialogs")}</h1>
    </div>
  );
};

export default Dialogs;
