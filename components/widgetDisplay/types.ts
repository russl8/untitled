import { DisplayId } from "@/store/features/dashboard/displaySlice";

export type Display = {
  displayId: DisplayId;
  displayAlias: string;
  displayName: string;
};

export type displaySize = "quartersize" | "halfsize" | "fullsize" | undefined;
