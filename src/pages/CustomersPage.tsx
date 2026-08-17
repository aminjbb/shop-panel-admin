import React from "react";
import CustomersContainer from "@/features/crm/ui/CustomersContainer";
import ProtectedRoute from "@/features/auth/ui/ProtectedRoute";

export interface CustomersPageProps {
  onRedirectToLogin?: () => void;
}

export const CustomersPage: React.FC<CustomersPageProps> = ({ onRedirectToLogin }) => {
  return (
    <ProtectedRoute onRedirectToLogin={onRedirectToLogin}>
      <CustomersContainer />
    </ProtectedRoute>
  );
};

export default CustomersPage;
