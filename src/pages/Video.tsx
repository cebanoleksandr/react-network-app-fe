import { useTranslation } from "react-i18next";

const Video = () => {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t("pages.video")}</h1>
    </div>
  );
};

export default Video;
