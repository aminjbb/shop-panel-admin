import { useAuth } from "@/features/auth/context/AuthContext";

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
