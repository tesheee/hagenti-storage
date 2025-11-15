// src/hooks/useRegisterPageActions.ts
import { useEffect } from "react";
import { usePageActions } from "@/components/layout/PageActionsContext";
import { LucideIcon } from "lucide-react";

export type PageAction = {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  color?: string;
};

export const useRegisterPageActions = (actions: PageAction[]) => {
  const { setActions } = usePageActions();

  useEffect(() => {
    setActions(actions);
    return () => setActions([]);
  }, []);
};
