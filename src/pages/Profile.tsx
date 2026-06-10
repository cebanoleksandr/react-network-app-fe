import { useTranslation } from "react-i18next";

const Profile = () => {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t("pages.profile")}</h1>
    </div>
  );
};

export default Profile;
