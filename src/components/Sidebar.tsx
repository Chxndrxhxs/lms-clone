import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  Home as House,
  Package,
  MessageSquare as Comments,
  User as UserIcon,
  ChevronDown as AngleDown,
  ChevronUp as AngleUp,
  PanelLeftClose,
  PanelLeftOpen,
  EllipsisVertical,
  ChevronRight,
  Settings,
  Users,
  Bell,
  HelpCircle,
  type LucideIcon,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router";

const USER_AVATAR =
  "https://d502jbuhuh9wk.cloudfront.net/t/static/images/default-user-avatar_fdbd4620c6b83170313f.png";

const userMenuItems = [
  { label: "Account settings", icon: Settings, href: "/t/myprofile" },
  { label: "Referrals", icon: Users, href: "/t/referrals" },
  { label: "Notifications", icon: Bell, href: "/t/notifications" },
  { label: "Help center", icon: HelpCircle, href: "/t/helpcenter" },
];

function UserMenu({ collapsed }: { collapsed: boolean }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [open]);

  return (
    <div ref={ref} className="mt-auto shrink-0 border-t border-gray-200 bg-white">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
        }}
        title={collapsed ? "chandrahas" : undefined}
        className={`flex w-full items-center gap-3 px-2 py-2.5 text-left hover:bg-neutral-50 ${
          collapsed ? "justify-center px-0" : ""
        }`}
      >
        <img src={USER_AVATAR} alt="User avatar" className="h-7 w-7 shrink-0" />
        {!collapsed && (
          <>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold capitalize text-neutral-900">chandrahas</p>
              <p className="truncate text-xs text-neutral-500">Super Admin</p>
            </div>
            <EllipsisVertical size={16} className="shrink-0 text-neutral-400" />
          </>
        )}
      </button>

      {open && !collapsed && (
        <div className="absolute bottom-20 left-3 z-50 w-64 border border-neutral-200 bg-white p-2 shadow-xl">
          <div className="mb-2">
            <a
              href="/t/upgrade"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center justify-between gap-3 p-2 text-sm font-medium text-neutral-900"
            >
              <span>Upgrade now</span>
            </a>
          </div>
          <div className="flex flex-col border-t border-neutral-100 pt-2">
            {userMenuItems.map(({ label, icon: Icon, href }) => (
              <a
                key={label}
                href={href}
                onClick={(e) => e.stopPropagation()}
                className="flex h-9 items-center gap-3 py-2 px-2 text-sm text-neutral-600 hover:bg-neutral-50"
              >
                <Icon size={16} className="text-neutral-400" />
                <span>{label}</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

type NavItemProps = {
  icon: LucideIcon;
  label: string;
  collapsed: boolean;
  active?: boolean;
  onClick: () => void;
  right?: ReactNode;
};

function NavItem({ icon: Icon, label, collapsed, active, onClick, right }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      title={collapsed ? label : undefined}
      className={`text-left max-h-[2.5rem] h-9 w-full flex gap-[8px] items-center transition-all relative px-2 ${
        collapsed ? "justify-center px-0" : "justify-start"
      } ${active ? "bg-neutral-100 text-neutral-950 font-medium" : "hover:bg-neutral-50"}`}
    >
      <span className={collapsed ? "flex justify-center" : "cursor-pointer text-neutral-400 pr-3 pl-[3px]"}>
        <Icon size={16} />
      </span>
      <div className={collapsed ? "hidden" : "w-full flex items-center justify-between"}>
        <h4 className="text-sm font-medium text-neutral-700">{label}</h4>
        {right}
      </div>
    </button>
  );
}

export function Sidebar() {
  const [productsOpen, setProductsOpen] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isCourses = pathname.startsWith("/courses");

  return (
    <aside
      className={`sticky top-0 relative flex h-screen shrink-0 flex-col border-r border-neutral-200 bg-white pt-5 overflow-hidden transition-[width] ${
        collapsed ? "w-16 px-2" : "w-64 px-3"
      }`}
    >
      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3.5 top-5 z-10 flex h-7 w-7 items-center justify-center border border-neutral-200 bg-white text-neutral-900 shadow-sm hover:bg-neutral-50 transition-colors"
        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? <PanelLeftOpen size={14} /> : <PanelLeftClose size={14} />}
      </button>

      {/* Logo */}
      <div className={`h-10 w-10 mb-5 cursor-pointer ${collapsed ? "mx-auto" : ""}`} onClick={() => navigate("/")}>
        <span className="block w-10">
          <img
            src="https://d502jbuhuh9wk.cloudfront.net/t/static/images/defaultOrg_83bee28077f95b04bfc6.png"
            alt="Sidebar logo"
            className="w-8 h-8 object-contain"
          />
        </span>
      </div>

      <div className="opacity-100 transition-opacity flex flex-col gap-2 flex-1 overflow-y-auto">
        {/* Home */}
        <NavItem
          icon={House}
          label="Home"
          collapsed={collapsed}
          active={pathname === "/"}
          onClick={() => navigate("/")}
        />

        {/* Products Dropdown */}
        <NavItem
          icon={Package}
          label="Products"
          collapsed={collapsed}
          onClick={() => {
            if (collapsed) {
              setCollapsed(false);
              setProductsOpen(true);
            } else {
              setProductsOpen(!productsOpen);
            }
          }}
          right={productsOpen ? <AngleUp size={14} /> : <AngleDown size={14} />}
        />

        {!collapsed && productsOpen && (
          <div className="flex flex-col gap-[8px] pl-2">
            <button
              onClick={() => navigate("/")}
              className="text-left w-full h-9 flex items-center gap-3 py-2 pl-2 hover:bg-neutral-50"
            >
              <span className="text-sm text-neutral-600 ml-6">AI Avatar</span>
            </button>
            <button
              onClick={() => navigate("/courses")}
              className={`text-left w-full h-9 flex items-center gap-3 py-2 pl-2 ${
                isCourses ? "bg-neutral-100 text-neutral-950 font-medium" : "hover:bg-neutral-50"
              }`}
            >
              <span className={`text-sm ml-6 ${isCourses ? "font-semibold" : "text-neutral-600"}`}>
                Courses
              </span>
            </button>
            <button
              onClick={() => navigate("/")}
              className="text-left w-full h-9 flex items-center gap-3 py-2 pl-2 hover:bg-[#F7F9FA]"
            >
              <span className="text-sm font-normal text-[#393F41] ml-6">Packages</span>
            </button>
            <button
              onClick={() => navigate("/")}
              className="text-left w-full h-9 flex items-center gap-3 py-2 pl-2 hover:bg-[#F7F9FA]"
            >
              <div className="flex items-center justify-between w-full pr-2">
                <span className="text-sm font-normal text-[#393F41] ml-6">Coaching</span>
                <span className="px-2 py-0.5 text-[10px] font-medium uppercase text-[#393F41] bg-[#FFE675]">Beta</span>
              </div>
            </button>
            <button
              onClick={() => navigate("/")}
              className="text-left w-full h-9 flex items-center gap-3 py-2 pl-2 hover:bg-[#F7F9FA]"
            >
              <span className="text-sm font-normal text-[#393F41] ml-6">Memberships</span>
            </button>
            <button
              onClick={() => navigate("/")}
              className="text-left w-full h-9 flex items-center gap-3 py-2 pl-2 hover:bg-[#F7F9FA]"
            >
              <span className="text-sm font-normal text-[#393F41] ml-6">Webinars</span>
            </button>
            <button
              onClick={() => navigate("/")}
              className="text-left w-full h-9 flex items-center gap-3 py-2 pl-2 hover:bg-[#F7F9FA]"
            >
              <span className="text-sm font-normal text-[#393F41] ml-6">Digital products</span>
            </button>
            <button
              onClick={() => navigate("/")}
              className="text-left w-full h-9 flex items-center gap-3 py-2 pl-2 hover:bg-[#F7F9FA]"
            >
              <span className="text-sm font-normal text-[#393F41] ml-6">Telegram communities</span>
            </button>
          </div>
        )}

        {/* Community */}
        <NavItem icon={Comments} label="Community" collapsed={collapsed} onClick={() => navigate("/")} />

        {/* Users */}
        <NavItem
          icon={UserIcon}
          label="Users"
          collapsed={collapsed}
          onClick={() => navigate("/")}
          right={<AngleDown size={14} />}
        />
      </div>

      {/* User */}
      <UserMenu collapsed={collapsed} />
    </aside>
  );
}
