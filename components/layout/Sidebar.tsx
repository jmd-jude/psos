// components/layout/Sidebar.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type * as Prisma from '@prisma/client';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Target,
  Building2,
  Grid3x3,
  CheckCircle,
  DollarSign,
  Settings,
  BookOpen,
  FolderTree,
  Package,
} from 'lucide-react';

const SIDEBAR_WIDTH = 280;

// Define the component's props structure
interface SidebarProps {
  verticals: Pick<Prisma.Vertical, 'id' | 'name'>[];
}

interface NavLinkProps {
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  nested?: boolean;
  children: React.ReactNode;
}

function NavLink({ href, icon: Icon, nested = false, children }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname?.startsWith(href + '/');

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
        nested && "pl-9", // Additional left padding for nested items
        isActive
          ? "bg-accent text-accent-foreground font-medium"
          : "text-muted-foreground hover:text-foreground"
      )}
    >
      {Icon && <Icon className="h-4 w-4" />}
      {children}
    </Link>
  );
}

interface NavSectionProps {
  title: string;
  children: React.ReactNode;
}

function NavSection({ title, children }: NavSectionProps) {
  return (
    <div className="mt-6 first:mt-0">
      <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
        {title}
      </h3>
      <div className="space-y-1">
        {children}
      </div>
    </div>
  );
}

export default function Sidebar({ verticals }: SidebarProps) {
  return (
    <aside
      className="fixed left-0 top-0 h-screen bg-card border-r border-border flex flex-col"
      style={{ width: SIDEBAR_WIDTH }}
    >
      {/* App Title */}
      <div className="h-16 flex items-center px-6 border-b border-border">
        <h1 className="text-lg font-bold text-primary">
          PSOS Prototype
        </h1>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto p-4">
        <NavLink href="/" icon={LayoutDashboard}>
          Dashboard
        </NavLink>

        <NavSection title="Core Entities">
          <NavLink href="/use-cases" icon={Target}>
            Use Cases
          </NavLink>
          <NavLink href="/matrix" icon={Grid3x3}>
            Prioritization Matrix
          </NavLink>
        </NavSection>

        <NavSection title="Evaluate Use Cases">
          <NavLink href="/assessments/evaluate" icon={CheckCircle}>
            Evaluate Use Case
          </NavLink>
        </NavSection>

        <NavSection title="Setup & Settings">
          <NavLink href="/settings/capabilities" icon={Settings}>
            Company Capabilities
          </NavLink>
          <NavLink href="/categories" icon={FolderTree}>
            Use-Case Categories
          </NavLink>
          <NavLink href="/delivery-mechanisms" icon={Package}>
            Delivery Mechanisms
          </NavLink>
          <NavLink href="/verticals" icon={Building2}>
            Verticals
          </NavLink>
          <NavLink href="/glossary" icon={BookOpen}>
            Glossary
          </NavLink>
        </NavSection>
      </nav>
    </aside>
  );
}
