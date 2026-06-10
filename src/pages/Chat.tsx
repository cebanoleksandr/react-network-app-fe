import { useTranslation } from "react-i18next";

const Chat = () => {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t("pages.chat")}</h1>
    </div>
  );
};

export default Chat;
