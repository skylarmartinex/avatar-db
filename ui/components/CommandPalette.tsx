"use client";
import React, { useEffect, useState } from 'react';
import { Command } from 'cmdk';
import { useRouter } from 'next/navigation';
import { Search, Box, Wand2, ShieldCheck, Layers, Package, Zap, ChevronRight, Hash } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function CommandPalette() {
    const [open, setOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };
        document.addEventListener('keydown', down);
        return () => document.removeEventListener('keydown', down);
    }, []);

    const runCommand = (command: () => void) => {
        setOpen(false);
        command();
    };

    return (
        <AnimatePresence>
            {open && (
                <Command.Dialog
                    open={open}
                    onOpenChange={setOpen}
                    label="Global Command Menu"
                    className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] p-6"
                >
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-2xl"
                        onClick={() => setOpen(false)}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -20, filter: 'blur(10px)' }}
                        animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, scale: 0.95, y: -20, filter: 'blur(10px)' }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="relative w-full max-w-2xl bg-[#0A0A0A] border-2 border-white/10 rounded-[2.5rem] shadow-[0_50px_100px_rgba(0,0,0,1)] overflow-hidden"
                    >
                        <div className="flex items-center px-8 border-b border-white/5 py-4">
                            <Search className="w-5 h-5 text-zinc-500 mr-4" />
                            <Command.Input
                                autoFocus
                                placeholder="Search modules, commands, or documentation..."
                                className="w-full h-14 bg-transparent outline-none text-white text-lg font-bold placeholder:text-zinc-800 tracking-tight"
                            />
                            <div className="flex gap-1 items-center ml-4">
                                <span className="text-[10px] bg-white/5 px-2 py-1 rounded-lg border border-white/5 text-zinc-600 font-black">ESC</span>
                            </div>
                        </div>

                        <Command.List className="p-4 h-[450px] overflow-y-auto custom-scrollbar">
                            <Command.Empty className="px-8 py-20 text-center flex flex-col items-center gap-6">
                                <div className="w-16 h-16 rounded-3xl bg-zinc-900 border border-white/5 flex items-center justify-center opacity-20">
                                    <Zap size={24} className="text-zinc-500" />
                                </div>
                                <p className="text-sm font-bold text-zinc-700 uppercase tracking-widest italic leading-relaxed max-w-[200px]">No neural matches detected in directory.</p>
                            </Command.Empty>

                            <div className="space-y-4 pt-4">
                                <Command.Group heading="QUICK NAVIGATION" className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.4em] px-6 py-4">
                                    <div className="grid grid-cols-1 gap-1">
                                        <CommandPaletteItem
                                            icon={Box}
                                            label="Browse Modules"
                                            onSelect={() => runCommand(() => router.push('/modules'))}
                                        />
                                        <CommandPaletteItem
                                            icon={Package}
                                            label="Packs Manager"
                                            onSelect={() => runCommand(() => router.push('/packs'))}
                                        />
                                        <CommandPaletteItem
                                            icon={Wand2}
                                            label="Prompt Builder"
                                            onSelect={() => runCommand(() => router.push('/builder'))}
                                        />
                                        <CommandPaletteItem
                                            icon={Layers}
                                            label="Batch Processor"
                                            onSelect={() => runCommand(() => router.push('/batch'))}
                                        />
                                        <CommandPaletteItem
                                            icon={ShieldCheck}
                                            label="System Audit"
                                            onSelect={() => runCommand(() => router.push('/lint'))}
                                        />
                                    </div>
                                </Command.Group>

                                <Command.Group heading="RECENT MODULES" className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.4em] px-6 py-4">
                                    <CommandPaletteItem
                                        icon={Hash}
                                        label="VN (Vietnamese)"
                                        secondary="Ethnicity Module"
                                        onSelect={() => runCommand(() => router.push('/modules/ET/VN'))}
                                    />
                                    <CommandPaletteItem
                                        icon={Hash}
                                        label="SG-A (Soft Goddess)"
                                        secondary="Face Module"
                                        onSelect={() => runCommand(() => router.push('/modules/FA/SG-A'))}
                                    />
                                    <CommandPaletteItem
                                        icon={Hash}
                                        label="SG-B (Soft Goddess)"
                                        secondary="Face Module"
                                        onSelect={() => runCommand(() => router.push('/modules/FA/SG-B'))}
                                    />
                                </Command.Group>
                            </div>
                        </Command.List>

                        <div className="flex items-center justify-between px-10 h-16 border-t border-white/5 bg-[#050505]">
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-2">
                                    <kbd className="bg-white/5 px-2 py-1 rounded-md border border-white/5 text-[9px] font-black text-zinc-600">↑↓</kbd>
                                    <span className="text-[9px] font-black text-zinc-700 uppercase">Navigate</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <kbd className="bg-white/5 px-2 py-1 rounded-md border border-white/5 text-[9px] font-black text-zinc-600">ENTER</kbd>
                                    <span className="text-[9px] font-black text-zinc-700 uppercase">Execute</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Zap size={12} className="text-blue-500" fill="currentColor" />
                                <span className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.2em]">Neural Search Active</span>
                            </div>
                        </div>
                    </motion.div>
                </Command.Dialog>
            )}
        </AnimatePresence>
    );
}

function CommandPaletteItem({ icon: Icon, label, secondary, onSelect }: any) {
    return (
        <Command.Item
            onSelect={onSelect}
            className="flex items-center justify-between px-6 py-4 rounded-3xl text-zinc-400 text-sm font-bold hover:bg-white/[0.03] transition-all cursor-pointer data-[selected=true]:bg-white data-[selected=true]:text-white relative group"
        >
            <div className="flex items-center gap-5 relative z-10">
                <div className="w-10 h-10 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-xl">
                    <Icon size={18} />
                </div>
                <div className="flex flex-col">
                    <span>{label}</span>
                    {secondary && <span className="text-[10px] text-zinc-600 font-black uppercase tracking-widest mt-0.5">{secondary}</span>}
                </div>
            </div>
            <ChevronRight size={16} className="text-zinc-800 group-hover:text-white group-hover:translate-x-1 transition-all" />
            <div className="absolute inset-x-2 inset-y-1 bg-white/[0.02] rounded-[1.5rem] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        </Command.Item>
    );
}
