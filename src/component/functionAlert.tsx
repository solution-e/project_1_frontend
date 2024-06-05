import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginAlertModal from "./LoginAlertModal"; // 作成したモーダルコンポーネントのパスを指定

const useRequireLogin = (isLoggedIn: boolean) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      setIsModalOpen(true);
    }
  }, [isLoggedIn]);

  const handleClose = () => {
    setIsModalOpen(false);
    navigate(-1);
  };

  const WarningModalComponent = () => (
    <LoginAlertModal isOpen={isModalOpen} onClose={handleClose} />
  );

  return { WarningModalComponent };
};

export default useRequireLogin;
