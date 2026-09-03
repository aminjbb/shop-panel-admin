import React from "react";
import type { LoginFormProps } from "../types";
import { useLoginFormModel } from "../models/useLoginFormModel";
import LoginHeader from "./LoginHeader";
import LoginInputs from "./LoginInputs";
import LoginSubmitButton from "./LoginSubmitButton";
import AllertMassage from "@/shared-app/allertMassage";

export const LoginForm: React.FC<LoginFormProps> = ({
  onSuccess,
  className = "",
}) => {
  const model = useLoginFormModel(onSuccess);
  const errorMessage = model.errors.general
    ? `${model.errors.general}${model.errors.requestId ? ` (کد پیگیری: ${model.errors.requestId})` : ""}`
    : null;

  return (
    <div className={`glass-card p-6 sm:p-8 w-full max-w-md mx-auto relative z-10 transition-all duration-300 ${className}`}>
      <LoginHeader />

      {errorMessage && (
        <div className="mb-5">
          <AllertMassage
            variant="danger"
            title="خطا در اعتبارسنجی ورود"
            message={errorMessage}
            onClose={model.clearGeneralError}
          />
        </div>
      )}

      <form onSubmit={model.handleSubmit} noValidate className="space-y-5">
        <LoginInputs
          email={model.email}
          onEmailChange={model.handleEmailChange}
          onEmailBlur={model.handleEmailBlur}
          emailError={model.errors.email}
          password={model.password}
          onPasswordChange={model.handlePasswordChange}
          onPasswordBlur={model.handlePasswordBlur}
          passwordError={model.errors.password}
          showPassword={model.showPassword}
          onToggleShowPassword={model.toggleShowPassword}
          rememberMe={model.rememberMe}
          onRememberMeChange={model.setRememberMe}
          disabled={model.isSubmitDisabled}
        />

        <LoginSubmitButton
          isLoading={model.isLoading}
          disabled={model.isSubmitDisabled}
          retryAfterSeconds={model.retryAfterSeconds}
        />
      </form>
    </div>
  );
};

export default LoginForm;
