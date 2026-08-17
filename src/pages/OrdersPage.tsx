import React from "react";
import OrdersContainer from "@/features/orders/ui/OrdersContainer";

export const OrdersPage: React.FC = () => {
  return (
    <div id="orders-page" className="w-full">
      <OrdersContainer />
    </div>
  );
};

export default OrdersPage;
