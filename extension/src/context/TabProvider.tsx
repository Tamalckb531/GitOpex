import { useState } from "react";
import type { ReactNode, FC } from "react";
import { TabContext } from "./TabContext";
import type { TabType } from "../types/data.type";

interface TabProviderProps {
  children: ReactNode;
  defaultTab?: TabType;
}

export const TabProvider: FC<TabProviderProps> = ({
  children,
  defaultTab = "signup",
}) => {
  const [tab, setTab] = useState<TabType>(defaultTab);

  return (
    <TabContext.Provider value={{ tab, setTab }}>
      {children}
    </TabContext.Provider>
  );
};
