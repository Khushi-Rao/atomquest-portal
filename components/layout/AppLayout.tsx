"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type NavItem = {
  icon: LucideIcon;
  label: string;
  href: string;
};

export type AppLayoutProps = {
  children: React.ReactNode;
  navItems: NavItem[];
  userName: string;
  userRole: string;
  userInitials: string;
  pageTitle: string;
};

function isNavActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AppLayout({
  children,
  navItems,
  userName,
  userRole,
  userInitials,
  pageTitle,
}: AppLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen">
      <aside className="sticky top-0 flex h-screen w-[200px] flex-col border-r border-gray-200 bg-white">
        <div className="mb-2 border-b border-gray-200 px-4 pb-3 pt-4">
          <p className="text-[15px] font-medium text-gray-900">GoalTrack</p>
          <p className="text-[11px] text-gray-500">AtomQuest 1.0</p>
        </div>

        <nav className="flex flex-1 flex-col">
          {navItems.map(({ icon: Icon, label, href }) => {
            const active = isNavActive(pathname, href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2 rounded-none px-4 py-2 text-[13px] ${
                  active
                    ? "bg-primary-light font-medium text-primary-text"
                    : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                <Icon className="size-4 shrink-0" />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto border-t border-gray-200 px-4 pb-4 pt-3">
          <div className="flex items-center gap-2">
            <div
              className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary-light text-[11px] font-medium text-primary-text"
              aria-hidden
            >
              {userInitials}
            </div>
            <div>
              <p className="text-[12px] font-medium text-gray-900">{userName}</p>
              <p className="text-[11px] text-gray-500">{userRole}</p>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-10 flex h-12 items-center justify-between border-b border-gray-200 bg-white px-5">
          <h1 className="text-[14px] font-medium text-gray-900">{pageTitle}</h1>
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-primary-light px-3 py-0.5 text-[11px] font-medium text-primary-text">
              Active Cycle
            </span>
            <button
              type="button"
              className="text-gray-500 transition-colors hover:text-gray-700"
              aria-label="Notifications"
            >
              <Bell className="size-4" />
            </button>
            <div
              className="flex size-7 items-center justify-center rounded-full bg-primary-light text-[10px] font-medium text-primary-text"
              aria-label={userName}
            >
              {userInitials}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-surface p-5">{children}</main>
      </div>
    </div>
  );
}
