import { useAuth } from "@/entities/auth";

export const useLoginWidgetModel = (onLoginSuccess?: () => void) => {
  const { isAuthenticated, user } = useAuth();

  const handleSuccess = () => {
    if (onLoginSuccess) {
      onLoginSuccess();
    }
  };

  return {
    isAuthenticated,
    user,
    handleSuccess,
  };
};
