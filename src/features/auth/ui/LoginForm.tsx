import React from "react";
import type { LoginFormProps } from "../types";
import { useLoginFormModel } from "../models/useLoginFormModel";
import LoginHeader from "./LoginHeader";
import LoginInputs from "./LoginInputs";
import LoginSubmitButton from "./LoginSubmitButton";
import LoginQuickFillBar from "./LoginQuickFillBar";
import AllertMassage from "@/shared-app/allertMassage";

export const LoginForm: React.FC<LoginFormProps> = ({
  onSuccess,
  className = "",
}) => {
  const model = useLoginFormModel(onSuccess);

  return (
    <div
      className={`glass-card p-6 sm:p-8 w-full max-w-md mx-auto relative z-10 transition-all duration-300 ${className}`}
    >
      {/* Header */}
      <LoginHeader />

      {/* General Alert Error Banner */}
      {model.errors.general && (
        <div className="mb-5">
          <AllertMassage
            variant="danger"
            title="خطا در اعتبارسنجی ورود"
            message={model.errors.general}
            onClose={model.clearGeneralError}
          />
        </div>
      )}

      {/* Form Area */}
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
          disabled={model.isLoading}
        />

        <LoginSubmitButton
          isLoading={model.isLoading}
          disabled={model.isLoading}
        />
      </form>

      {/* Quick Fill Dev Bar */}
      <LoginQuickFillBar
        onSelectPreset={model.handleSelectPreset}
        onSimulateError={model.handleSimulateError}
        disabled={model.isLoading}
      />
    </div>
  );
};

export default LoginForm;
