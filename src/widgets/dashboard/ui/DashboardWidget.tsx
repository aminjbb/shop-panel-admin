import React from "react";
import type { DashboardWidgetProps } from "../types";
import { useDashboardModel } from "../models/useDashboardModel";
import DashboardHeader from "./DashboardHeader";
import DashboardStats from "./DashboardStats";
import DashboardRoleMatrix from "./DashboardRoleMatrix";
import DashboardSessionInspector from "./DashboardSessionInspector";

export const DashboardWidget: React.FC<DashboardWidgetProps> = ({ onLogout }) => {
  const model = useDashboardModel(onLogout);

  if (!model.user) {
    return null;
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-10 relative">
      <div className="max-w-7xl mx-auto relative z-10">
        <DashboardHeader
          user={model.user}
          rememberMe={model.rememberMe}
          onLogout={model.handleLogout}
          isLoggingOut={model.isLoggingOut}
        />

        <DashboardStats
          user={model.user}
          rememberMe={model.rememberMe}
          token={model.token}
        />

        <DashboardRoleMatrix user={model.user} />

        <DashboardSessionInspector
          user={model.user}
          token={model.token}
          rememberMe={model.rememberMe}
        />
      </div>
    </div>
  );
};

export default DashboardWidget;
