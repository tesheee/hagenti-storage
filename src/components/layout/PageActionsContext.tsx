import { createContext, useContext, ReactNode, useState } from "react";
import { LucideIcon } from "lucide-react";

type PageAction = {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  color?: string;
};

type PageActionsContextType = {
  actions: PageAction[];
  setActions: (actions: PageAction[]) => void;
};

const PageActionsContext = createContext<PageActionsContextType>({
  actions: [],
  setActions: () => {},
});

export const PageActionsProvider = ({ children }: { children: ReactNode }) => {
  const [actions, setActions] = useState<PageAction[]>([]);

  return (
    <PageActionsContext.Provider value={{ actions, setActions }}>
      {children}
    </PageActionsContext.Provider>
  );
};

export const usePageActions = () => useContext(PageActionsContext);
