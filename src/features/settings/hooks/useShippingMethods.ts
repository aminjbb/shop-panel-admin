import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { shippingMethodApi } from "@/entities/shipping-method";
import type { CreateShippingMethodPayload, ShippingMethod } from "@/types/settings";
import useToastStore from "@/shared-app/designSystem/toast/store";
import { mapShippingMethod, toShippingMethodInput } from "../models/settingsMappers";

export function useShippingMethods() {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ["shipping-methods", "list"],
    queryFn: ({ signal }) => shippingMethodApi.list(signal),
    select: (items) => items.map(mapShippingMethod),
  });
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["shipping-methods"] });
  const toggle = useMutation({ mutationFn: shippingMethodApi.toggleStatus, onSuccess: invalidate });
  const create = useMutation({ mutationFn: (payload: CreateShippingMethodPayload) => shippingMethodApi.create(toShippingMethodInput(payload)), onSuccess: invalidate });
  const update = useMutation({ mutationFn: ({ id, payload }: { id: string; payload: Partial<ShippingMethod> }) => {
    const current = query.data?.find((item) => item.id === id);
    if (!current) throw new Error("روش ارسال پیدا نشد.");
    return shippingMethodApi.update(id, toShippingMethodInput({ ...current, ...payload }));
  }, onSuccess: invalidate });
  const remove = useMutation({ mutationFn: shippingMethodApi.remove, onSuccess: invalidate });
  const report = async <T,>(promise: Promise<T>, successMessage: string) => {
    try { await promise; useToastStore.success(successMessage); return { success: true }; }
    catch (error) { const message = error instanceof Error ? error.message : "خطا در عملیات روش ارسال"; useToastStore.error(message); return { success: false, error: message }; }
  };
  return {
    shippingMethods: query.data ?? [], isLoading: query.isLoading,
    error: query.error instanceof Error ? query.error.message : null,
    isSubmitting: create.isPending || update.isPending || remove.isPending,
    toggleMethodStatus: (id: string) => report(toggle.mutateAsync(id), "وضعیت روش ارسال تغییر کرد."),
    createShippingMethod: (payload: CreateShippingMethodPayload) => report(create.mutateAsync(payload), "روش ارسال افزوده شد."),
    updateShippingMethod: (id: string, payload: Partial<ShippingMethod>) => report(update.mutateAsync({ id, payload }), "روش ارسال به‌روزرسانی شد."),
    deleteShippingMethod: (id: string) => report(remove.mutateAsync(id), "روش ارسال حذف شد."),
    refetch: query.refetch,
  };
}
export default useShippingMethods;
