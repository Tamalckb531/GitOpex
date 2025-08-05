import { createContext } from "react";
import type { TabContextType } from "../types/data.type";

export const TabContext = createContext<TabContextType | null>(null);
