// components/layout/Sidebar.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type * as Prisma from '@prisma/client';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

const SIDEBAR_WIDTH = 280;

// Define the component's props structure
interface SidebarProps {
  verticals: Pick<Prisma.Vertical, 'id' | 'name'>[];
}

export default function Sidebar({ verticals }: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Dashboard' },
    { href: '/use-cases', label: 'Use Cases' },
    { href: '/matrix', label: 'Prioritization Matrix' },
    { href: '/assessments/maturity', label: 'Maturity Assessment' },
    { href: '/assessments/opportunity', label: 'Opportunity Scoring' },
    { href: '/glossary', label: 'Glossary' },
  ];

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
      <nav className="flex-1 overflow-y-auto p-2">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "block px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-muted"
                  )}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <Separator className="my-4" />

        {/* Vertical Market Segments */}
        <div className="px-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 px-3">
            Verticals
          </p>
          <ul className="space-y-1">
            {verticals.length > 0 ? (
              verticals.map((vertical) => {
                const isActive = pathname === `/verticals/${vertical.id}`;
                return (
                  <li key={vertical.id}>
                    <Link
                      href={`/verticals/${vertical.id}`}
                      className={cn(
                        "block px-3 py-1.5 rounded-md text-sm transition-colors",
                        isActive
                          ? "bg-muted text-foreground font-medium"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      {vertical.name}
                    </Link>
                  </li>
                );
              })
            ) : (
              <p className="text-sm text-destructive px-3">
                Error: Could not load verticals.
              </p>
            )}
          </ul>
        </div>
      </nav>
    </aside>
  );
}
