import { Bot, Inbox, RadioTower, Reply, Settings, WalletCards } from "lucide-react";
import type { ComponentType } from "react";
import type { Surface } from "../domain/types";

type SidebarIcon = ComponentType<{ size?: number }>;

const items: Array<{ surface: Surface; label: string; icon: SidebarIcon }> = [
  { surface: "inbox", label: "Inbox", icon: Inbox },
  { surface: "channels", label: "Channels", icon: RadioTower },
  { surface: "replies", label: "Replies", icon: Reply },
  { surface: "agents", label: "Agents", icon: Bot },
  { surface: "wallet", label: "Wallet", icon: WalletCards },
  { surface: "settings", label: "Settings", icon: Settings },
];

export function Sidebar({
  activeSurface,
  onSurfaceChange,
}: {
  activeSurface: Surface;
  onSurfaceChange: (surface: Surface) => void;
}) {
  return (
    <nav className="sidebar" aria-label="Freexster surfaces">
      {items.map((item) => {
        const Icon = item.icon;

        return (
          <button
            key={item.surface}
            className={item.surface === activeSurface ? "sidebar-item active" : "sidebar-item"}
            type="button"
            onClick={() => onSurfaceChange(item.surface)}
          >
            <Icon size={18} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
