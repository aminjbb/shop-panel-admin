import React from "react";
import type { LoginSubmitButtonProps } from "../types";
import { EButton } from "@/shared-app/designSystem/button";
import { LogIn } from "lucide-react";

export const LoginSubmitButton: React.FC<LoginSubmitButtonProps> = ({
  isLoading,
  disabled = false,
}) => {
  return (
    <div className="pt-2">
      <EButton
        id="login-submit-button"
        type="submit"
        variant="primary"
        size="lg"
        isLoading={isLoading}
        disabled={disabled}
        className="w-full text-base font-semibold"
        icon={<LogIn className="w-5 h-5" />}
      >
        {isLoading ? "در حال احراز هویت و برقراری ارتباط..." : "ورود به سامانه"}
      </EButton>
    </div>
  );
};

export default LoginSubmitButton;
