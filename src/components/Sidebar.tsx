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
        className={`flex w-full items-center gap-3 rounded-lg px-2 py-2.5 text-left hover:bg-[#F7F9FA] ${
          collapsed ? "justify-center px-0" : ""
        }`}
      >
        <img src={USER_AVATAR} alt="User avatar" className="h-7 w-7 shrink-0 rounded-full" />
        {!collapsed && (
          <>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium capitalize text-[#2D4750]">chandrahas</p>
              <p className="truncate text-xs capitalize text-[#878C90] opacity-60">Super Admin</p>
            </div>
            <EllipsisVertical size={16} className="shrink-0 text-[#878C90]" />
          </>
        )}
      </button>

      {open && !collapsed && (
        <div className="absolute bottom-16 left-3 z-50 w-64 rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-lg">
          <div className="mb-6">
            <a
              href="/t/upgrade"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center justify-between gap-3"
            >
              <span className="block w-full rounded-lg bg-[#EEF0F4] py-2.5 text-center text-sm font-normal text-[#0F1013]">
                Upgrade now
              </span>
              <ChevronRight size={16} className="shrink-0 text-[#878C90]" />
            </a>
          </div>
          <div className="flex flex-col gap-2">
            {userMenuItems.map(({ label, icon: Icon, href }) => (
              <a
                key={label}
                href={href}
                onClick={(e) => e.stopPropagation()}
                className="flex h-9 items-center gap-3 rounded-[6px] py-2 pl-2 text-sm font-normal text-[#393F41] hover:bg-[#F7F9FA]"
              >
                <Icon size={16} className="text-[#878C90]" />
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
      className={`text-left max-h-[2.5rem] h-9 w-full flex gap-[8px] rounded-[6px] items-center transition-all relative px-2 ${
        collapsed ? "justify-center px-0" : "justify-start"
      } ${active ? "bg-indigo-50/70 text-indigo-950 font-semibold" : "hover:bg-[#F7F9FA]"}`}
    >
      <span className={collapsed ? "flex justify-center" : "cursor-pointer text-[#878C90] pr-3 pl-[3px]"}>
        <Icon size={18} />
      </span>
      <div className={collapsed ? "hidden" : "w-full flex items-center justify-between text-[#2D4750]"}>
        <h4 className="text-sm font-normal text-[#393F41]">{label}</h4>
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
      className={`sticky top-0 relative flex h-screen shrink-0 flex-col border-r border-gray-200 bg-white pt-5 overflow-hidden transition-[width] ${
        collapsed ? "w-16 px-2" : "w-64 px-3"
      }`}
    >
      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3.5 top-5 z-10 flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 bg-white text-[#4E5DE0] shadow-md hover:bg-[#4E5DE0] hover:text-white hover:shadow-lg transition-colors"
        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? <PanelLeftOpen size={15} /> : <PanelLeftClose size={15} />}
      </button>

      {/* Logo */}
      <div className={`h-10 w-10 mb-5 cursor-pointer ${collapsed ? "mx-auto" : ""}`} onClick={() => navigate("/")}>
        <span className="block w-10">
          <img
            src="https://d502jbuhuh9wk.cloudfront.net/t/static/images/defaultOrg_83bee28077f95b04bfc6.png"
            alt="Sidebar logo"
            className="w-10 h-10 object-contain rounded-lg"
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
              className="text-left w-full h-9 rounded-[6px] flex items-center gap-3 py-2 pl-2 hover:bg-[#F7F9FA]"
            >
              <span className="text-sm font-normal text-[#393F41] ml-6">AI Avatar</span>
            </button>
            <button
              onClick={() => navigate("/courses")}
              className={`text-left w-full h-9 rounded-[6px] flex items-center gap-3 py-2 pl-2 ${
                isCourses ? "bg-[#F2F4FF] text-[#5160E5] font-medium" : "hover:bg-[#F7F9FA]"
              }`}
            >
              <span className={`text-sm ml-6 ${isCourses ? "text-[#5160E5] font-semibold" : "text-[#393F41]"}`}>
                Courses
              </span>
            </button>
            <button
              onClick={() => navigate("/")}
              className="text-left w-full h-9 rounded-[6px] flex items-center gap-3 py-2 pl-2 hover:bg-[#F7F9FA]"
            >
              <span className="text-sm font-normal text-[#393F41] ml-6">Packages</span>
            </button>
            <button
              onClick={() => navigate("/")}
              className="text-left w-full h-9 rounded-[6px] flex items-center gap-3 py-2 pl-2 hover:bg-[#F7F9FA]"
            >
              <div className="flex items-center justify-between w-full pr-2">
                <span className="text-sm font-normal text-[#393F41] ml-6">Coaching</span>
                <span className="rounded-[100px] px-2 py-0.5 text-[10px] font-medium uppercase text-[#393F41] bg-[#FFE675]">Beta</span>
              </div>
            </button>
            <button
              onClick={() => navigate("/")}
              className="text-left w-full h-9 rounded-[6px] flex items-center gap-3 py-2 pl-2 hover:bg-[#F7F9FA]"
            >
              <span className="text-sm font-normal text-[#393F41] ml-6">Memberships</span>
            </button>
            <button
              onClick={() => navigate("/")}
              className="text-left w-full h-9 rounded-[6px] flex items-center gap-3 py-2 pl-2 hover:bg-[#F7F9FA]"
            >
              <span className="text-sm font-normal text-[#393F41] ml-6">Webinars</span>
            </button>
            <button
              onClick={() => navigate("/")}
              className="text-left w-full h-9 rounded-[6px] flex items-center gap-3 py-2 pl-2 hover:bg-[#F7F9FA]"
            >
              <span className="text-sm font-normal text-[#393F41] ml-6">Digital products</span>
            </button>
            <button
              onClick={() => navigate("/")}
              className="text-left w-full h-9 rounded-[6px] flex items-center gap-3 py-2 pl-2 hover:bg-[#F7F9FA]"
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
