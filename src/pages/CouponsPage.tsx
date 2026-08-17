import React from "react";
import CouponsContainer from "@/features/coupons/ui/CouponsContainer";
import ProtectedRoute from "@/features/auth/ui/ProtectedRoute";

export interface CouponsPageProps {
  onRedirectToLogin?: () => void;
}

export const CouponsPage: React.FC<CouponsPageProps> = ({ onRedirectToLogin }) => {
  return (
    <ProtectedRoute onRedirectToLogin={onRedirectToLogin}>
      <CouponsContainer />
    </ProtectedRoute>
  );
};

export default CouponsPage;
