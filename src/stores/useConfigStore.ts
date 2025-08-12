// stores/useConfigStore.ts
import { create } from "zustand";

interface Config {
  error: string;
  name: string;
  slogan: string;
  logo: string;
  staff_identity_store_id: string;
}

interface ConfigState {
  config: Config | null;
  setConfig: (data: Config) => void;
}

export const useConfigStore = create<ConfigState>((set) => ({
  config: null,
  setConfig: (data) => set({ config: data }),
}));
