// utils/icon-map.ts
import {
  Home,
  User,
  Settings,
  Folder,
  FileText,
  Lock,
  LogOut,
} from "lucide-react";

export const iconMap: Record<string, React.ElementType> = {
  home: Home,
  user: User,
  settings: Settings,
  folder: Folder,
  file: FileText,
  lock: Lock,
  logout: LogOut,
};