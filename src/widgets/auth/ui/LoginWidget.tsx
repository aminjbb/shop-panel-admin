import React from "react";
import type { LoginWidgetProps } from "../types";
import { useLoginWidgetModel } from "../models/useLoginWidgetModel";
import LoginForm from "@/features/auth/ui/LoginForm";
import LoginBrandingSection from "./LoginBrandingSection";

export const LoginWidget: React.FC<LoginWidgetProps> = ({ onLoginSuccess }) => {
  const model = useLoginWidgetModel(onLoginSuccess);

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-10">
      {/* Main Container */}
      <div className="w-full max-w-5xl flex flex-col lg:flex-row items-stretch justify-center gap-6 relative z-10">
        <LoginBrandingSection />
        <LoginForm onSuccess={model.handleSuccess} />
      </div>
    </div>
  );
};

export default LoginWidget;
