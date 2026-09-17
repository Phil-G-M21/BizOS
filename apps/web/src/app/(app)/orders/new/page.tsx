"use client";

import { useRouter } from "next/navigation";
import { OrderForm } from "../order-form";

export default function NewOrderPage() {
  const router = useRouter();

  return (
    <div className="max-w-2xl">
      <div className="mb-5">
        <div className="text-sm font-medium text-slate-500">Orders</div>
        <h1 className="text-2xl font-bold text-slate-900">Create an order</h1>
        <p className="mt-1 text-sm text-slate-500">
          Select a customer, add products, and set a delivery fee. The total is calculated as you go.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <OrderForm
          onCancel={() => router.push("/orders")}
          onSaved={() => {
            router.push("/orders");
            router.refresh();
          }}
        />
      </div>
    </div>
  );
}
