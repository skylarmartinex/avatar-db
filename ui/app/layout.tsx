"use client";
import React, { useState, useEffect } from 'react';
import { Inter } from "next/font/google";
import "./globals.css";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Box,
  Package,
  Wand2,
  Layers,
  ShieldCheck,
  Search,
  Menu,
  X,
  Zap,
  Github,
  Command as CommandIcon,
  ChevronRight,
  FileJson
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { CommandPalette } from '../components/CommandPalette';
import { motion, AnimatePresence } from 'framer-motion';

const inter = Inter({
  subsets: ["latin"],
  variable: '--font-inter',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navItems = [
    { name: 'Browse', href: '/browse', icon: Search },
    { name: 'Modules', href: '/modules', icon: Box },
    { name: 'Packs', href: '/packs', icon: Package },
    { name: 'Prompts', href: '/prompts', icon: FileJson },
    { name: 'Builder', href: '/builder', icon: Wand2 },
    { name: 'Batch', href: '/batch', icon: Layers },
    { name: 'Audit', href: '/lint', icon: ShieldCheck },
  ];

  return (
    <html lang="en" className={cn("dark", inter.variable)} suppressHydrationWarning>
      <body
        className={cn(
          inter.className,
          "bg-black text-white min-h-screen flex antialiased"
        )}
        suppressHydrationWarning
      >
        <div className="flex w-full min-h-screen bg-black overflow-hidden selection:bg-blue-500/30">
          <CommandPalette />

          {/* Sidebar */}
          <aside className={cn(
            "fixed inset-y-0 left-0 z-50 w-72 bg-black border-r border-white/5 transition-all duration-300 transform lg:relative lg:translate-x-0",
            !isSidebarOpen && "-translate-x-full lg:hidden"
          )}>
            <div className="h-full flex flex-col p-8">
              <div className="flex items-center gap-4 mb-14 px-2 group cursor-pointer">
                <div className="relative">
                  <div className="absolute -inset-2 bg-blue-500/20 rounded-full blur-xl group-hover:bg-blue-500/40 transition-all duration-500" />
                  <div className="relative w-9 h-9 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center shadow-2xl">
                    <Zap size={18} className="text-blue-500" fill="currentColor" />
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-black tracking-[0.2em] text-white uppercase italic">
                    Avatar<span className="text-blue-500">.</span>DB
                  </span>
                  <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mt-0.5">Prompt Engine</span>
                </div>
              </div>

              <nav className="flex-1 space-y-2">
                {navItems.map((item) => {
                  const isActive = pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative",
                        isActive
                          ? "text-white bg-white/[0.03] shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]"
                          : "text-zinc-500 hover:text-white hover:bg-white/[0.01]"
                      )}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="nav-glow"
                          className="absolute -left-1 w-1 h-5 bg-blue-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.8)]"
                          transition={{ duration: 0.5, type: "spring", bounce: 0.2 }}
                        />
                      )}
                      <item.icon size={18} className={cn(
                        "relative z-10 transition-colors duration-300",
                        isActive ? "text-blue-500" : "group-hover:text-zinc-300"
                      )} />
                      <span className="relative z-10 text-sm font-bold tracking-tight">{item.name}</span>
                    </Link>
                  );
                })}
              </nav>

              <div className="mt-auto space-y-6">
                <div className="p-5 rounded-3xl bg-zinc-900/30 border border-white/[0.03] space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-zinc-800 to-black border border-white/10 flex items-center justify-center text-xs font-black text-white shadow-xl">SM</div>
                    <div className="flex-1 overflow-hidden">
                      <p className="text-xs font-bold text-zinc-100 truncate">Skylar Martinez</p>
                      <p className="text-[10px] text-blue-500 font-black uppercase tracking-tighter mt-0.5">Core Architect</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between px-2 opacity-50">
                  <span className="text-[10px] font-black tracking-widest text-zinc-700 uppercase">Version 1.0</span>
                  <div className="flex gap-3">
                    <Github size={14} className="text-zinc-700 hover:text-white transition-colors cursor-pointer" />
                    <CommandIcon size={14} className="text-zinc-700 hover:text-white transition-colors cursor-pointer" />
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col h-screen overflow-hidden">
            {/* Top Navigation */}
            <header className="h-24 flex items-center justify-between px-12 border-b border-white/[0.05] bg-black/60 backdrop-blur-3xl shrink-0">
              <div className="flex items-center gap-8">
                <button
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="lg:hidden p-3 bg-zinc-900 border border-white/5 rounded-2xl text-zinc-400 hover:text-white transition-all shadow-xl"
                >
                  {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                </button>

                <div className="flex items-center gap-3 px-4 py-2 bg-zinc-900/50 border border-white/[0.05] rounded-full">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">System Nominal</span>
                </div>
              </div>

              <div className="flex items-center gap-8">
                <div
                  className="hidden xl:flex items-center gap-4 px-5 py-2.5 bg-white/[0.02] border border-white/[0.05] rounded-2xl text-zinc-600 hover:text-white transition-all cursor-pointer hover:border-white/10 group active:scale-95 shadow-2xl shadow-black"
                  onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))}
                >
                  <Search size={16} className="group-hover:text-blue-500 transition-colors" />
                  <span className="text-xs font-bold tracking-tight">Search prompt modules...</span>
                  <div className="flex gap-1 ml-6">
                    <span className="text-[9px] bg-white/[0.05] px-2 py-1 rounded-lg border border-white/5 font-mono text-zinc-500">⌘</span>
                    <span className="text-[9px] bg-white/[0.05] px-2 py-1 rounded-lg border border-white/5 font-mono text-zinc-500">K</span>
                  </div>
                </div>

                <div className="hidden lg:flex items-center gap-4 px-4 py-2 border-l border-white/10">
                  <div className="text-right">
                    <p className="text-[10px] font-black text-zinc-700 uppercase tracking-widest">Active Cluster</p>
                    <p className="text-xs font-bold text-white">DB-PH-GHOST</p>
                  </div>
                  <div className="w-10 h-10 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center">
                    <LayoutDashboard size={18} className="text-zinc-600" />
                  </div>
                </div>
              </div>
            </header>

            <main className="flex-1 overflow-y-auto custom-scrollbar p-12 lg:p-20 relative">
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/5 blur-[120px] rounded-full pointer-events-none" />

              <AnimatePresence mode="wait">
                <motion.div
                  key={pathname}
                  initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -30, filter: 'blur(10px)' }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="max-w-7xl mx-auto w-full relative z-10"
                >
                  {children}
                </motion.div>
              </AnimatePresence>
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}

function LayoutDashboard(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1" /><rect width="7" height="5" x="14" y="3" rx="1" /><rect width="7" height="9" x="14" y="12" rx="1" /><rect width="7" height="5" x="3" y="16" rx="1" /></svg>
  )
}
