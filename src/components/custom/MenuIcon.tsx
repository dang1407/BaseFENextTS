import { iconMap } from "@/utils/icon-map";

export function MenuIcon({ name }: { name?: string }) {
  if (!name) return null;

  const IconComponent = iconMap[name.toLowerCase()];
  if (!IconComponent) return null; // fallback nếu không tìm thấy

  return <IconComponent className="w-5 h-5" />;
}
