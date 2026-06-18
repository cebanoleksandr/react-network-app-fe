import type { SvgIconProps } from "@mui/material";
import type { ComponentType } from "react";

export interface ISidebarItem {
  label: string;
  path: string;
  end?: boolean;
  icon: ComponentType<SvgIconProps>;
  badge?: number;
}
