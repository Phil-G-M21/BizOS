"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { OrderForm, type InitialOrderLine } from "../../order-form";

const EDITABLE_STATUSES = ["draft", "pending_payment"];

export default function EditOrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [lines, setLines] = useState<InitialOrderLine[]>([]);

  useEffect(() => {
    async function load() {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        router.push("/login");
        return;
      }

      const { data: businesses } = await supabase
        .from("businesses")
        .select("id")
        .order("created_at", { ascending: true })
        .limit(1);
      const business = businesses?.[0];
      if (!business) {
        router.push("/onboarding");
        return;
      }

      const { data: order, error: fetchError } = await supabase
        .from("orders")
        .select("id, status, customer_id, delivery_fee")
        .eq("id", id)
        .eq("business_id", business.id)
        .single();

      if (fetchError || !order) {
        router.push("/orders");
        return;
      }

      // Stock and payments have already been applied via triggers for any
      // order past this stage — editing it here would desync them.
      if (!EDITABLE_STATUSES.includes(order.status)) {
        router.push(`/orders/${id}`);
        return;
      }

      const { data: items } = await supabase
        .from("order_items")
        .select("product_id, name, unit_price, quantity")
        .eq("order_id", id);

      setCustomerId(order.customer_id);
      setDeliveryFee(order.delivery_fee);
      setLines(
        (items ?? []).map((item) => ({
          productId: item.product_id ?? "",
          name: item.name,
          unitPrice: item.unit_price,
          quantity: item.quantity,
        }))
      );
      setLoading(false);
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) {
    return <p className="text-sm text-slate-500">Loading...</p>;
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-5">
        <div className="text-sm font-medium text-slate-500">Orders</div>
        <h1 className="text-2xl font-bold text-slate-900">Edit order</h1>
        <p className="mt-1 text-sm text-slate-500">
          Update the customer, items, or delivery fee. The total is recalculated as you go.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <OrderForm
          orderId={id}
          initialCustomerId={customerId}
          initialDeliveryFee={deliveryFee}
          initialLines={lines}
          onCancel={() => router.push(`/orders/${id}`)}
          onSaved={() => {
            router.push(`/orders/${id}`);
            router.refresh();
          }}
        />
      </div>
    </div>
  );
}
