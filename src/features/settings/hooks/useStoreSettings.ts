import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { storeSettingsApi } from "@/entities/store-settings";
import type { StoreSettings } from "@/types/settings";
import useToastStore from "@/shared-app/designSystem/toast/store";
import { mapStoreSettings, toStoreSettingsInput } from "../models/settingsMappers";

export function useStoreSettings() {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ["store-settings", "detail"],
    queryFn: ({ signal }) => storeSettingsApi.get(signal),
    select: mapStoreSettings,
  });
  const mutation = useMutation({
    mutationFn: (settings: StoreSettings) => storeSettingsApi.update(toStoreSettingsInput(settings)),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["store-settings"] });
      useToastStore.success("تنظیمات فروشگاه با موفقیت ذخیره شد.");
    },
    onError: (error) => useToastStore.error(error instanceof Error ? error.message : "خطا در ذخیره تنظیمات"),
  });
  return {
    settings: query.data ?? null,
    isLoading: query.isLoading,
    isSaving: mutation.isPending,
    error: query.error instanceof Error ? query.error.message : null,
    saveSettings: async (settings: StoreSettings) => {
      try { await mutation.mutateAsync(settings); return { success: true }; }
      catch (error) { return { success: false, error: error instanceof Error ? error.message : "خطا در ذخیره تنظیمات" }; }
    },
    refetch: query.refetch,
  };
}
export default useStoreSettings;
