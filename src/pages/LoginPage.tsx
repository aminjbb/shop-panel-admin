import React from "react";
import LoginWidget from "@/widgets/auth/ui/LoginWidget";

export interface LoginPageProps {
  onLoginSuccess?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  return <LoginWidget onLoginSuccess={onLoginSuccess} />;
};

export default LoginPage;
