"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Box, ChevronRight, Hash, Sparkles, Binary, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { motion, Variants } from 'framer-motion';
import { cn } from '@/lib/utils';

const DIMS = [
    { id: 'FA', name: 'Face', desc: 'Symmetry, anchors, and identity-defining biological markers.', accent: 'blue' },
    { id: 'BT', name: 'Body', desc: 'Physique architecture, skeletal posture, and anatomical constraints.', accent: 'indigo' },
    { id: 'ET', name: 'Ethnicity', desc: 'Cultural phenotypes, ancestral traits, and global skin-tone palettes.', accent: 'violet' },
    { id: 'HR', name: 'Hair', desc: 'Texture physics, style layering, and flow-field aerodynamics.', accent: 'fuchsia' },
    { id: 'SC', name: 'Scene', desc: 'Spatial lighting, environmental depth, and volumetric backgrounds.', accent: 'emerald' },
    { id: 'ST', name: 'Outfit', desc: 'Material science, fashion physics, and garment-layering rules.', accent: 'rose' },
    { id: 'NB', name: 'Negative', desc: 'Entropy suppression and quality control baseline filters.', accent: 'zinc' },
];

const container: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    }
};

const item: Variants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    show: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1]
        }
    }
};

export default function ModulesPage() {
    const [counts, setCounts] = useState<Record<string, number>>({});

    useEffect(() => {
        fetch('/api/registry')
            .then(res => res.json())
            .then(data => {
                const c: Record<string, number> = {};
                Object.keys(data).forEach(dim => {
                    c[dim] = Object.keys(data[dim]).length;
                });
                setCounts(c);
            });
    }, []);

    return (
        <div className="space-y-24 pb-40 relative">
            <div className="space-y-10 max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/[0.03] border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl"
                >
                    <Sparkles size={14} className="text-blue-500 fill-blue-500/20" />
                    Neural Component Registry v1.0
                </motion.div>

                <div className="space-y-6">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, duration: 0.8 }}
                        className="text-8xl lg:text-9xl font-black tracking-[-0.04em] text-white leading-[0.9]"
                    >
                        System <br />
                        <span className="text-zinc-800">Modules.</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        className="text-zinc-500 text-2xl font-medium leading-relaxed max-w-3xl"
                    >
                        Architectural building blocks for the deterministic prompt engine.
                        Standardized logic gates for identity and style control.
                    </motion.p>
                </div>
            </div>

            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-10"
            >
                {DIMS.map((dim) => (
                    <motion.div key={dim.id} variants={item}>
                        <Link href={`/modules/${dim.id}`} className="block group h-full">
                            <Card className="h-full bg-[#050505] border-white/5 hover:border-white/20 transition-all duration-700 shadow-none relative overflow-hidden group-hover:bg-[#080808]">
                                {/* Accent Glow */}
                                <div className={cn(
                                    "absolute -top-24 -right-24 w-48 h-48 blur-[100px] opacity-0 group-hover:opacity-20 transition-opacity duration-1000",
                                    dim.accent === 'blue' && "bg-blue-600",
                                    dim.accent === 'indigo' && "bg-indigo-600",
                                    dim.accent === 'violet' && "bg-violet-600",
                                    dim.accent === 'fuchsia' && "bg-fuchsia-600",
                                    dim.accent === 'emerald' && "bg-emerald-600",
                                    dim.accent === 'rose' && "bg-rose-600",
                                    dim.accent === 'zinc' && "bg-white",
                                )} />

                                <CardContent className="p-12 flex flex-col h-full justify-between gap-16 relative z-10">
                                    <div className="flex justify-between items-start">
                                        <div className="w-16 h-16 rounded-[2rem] bg-zinc-900 border border-white/5 flex items-center justify-center group-hover:scale-110 group-hover:bg-white group-hover:text-black transition-all duration-700 shadow-2xl">
                                            <Binary size={28} className="transition-colors duration-700" />
                                        </div>
                                        <div className="flex items-center gap-2.5 px-5 py-2 bg-black rounded-full border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
                                            <Hash size={12} className="text-zinc-600" />
                                            <span className="text-sm font-black text-white/90">{counts[dim.id] || 0}</span>
                                        </div>
                                    </div>

                                    <div className="space-y-5">
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="text-4xl tracking-tighter group-hover:text-white transition-colors duration-700">{dim.name}</CardTitle>
                                            <div className="w-10 h-10 rounded-full border border-white/5 flex items-center justify-center -rotate-45 group-hover:rotate-0 group-hover:border-white group-hover:bg-white group-hover:text-black transition-all duration-700">
                                                <ArrowRight size={20} />
                                            </div>
                                        </div>
                                        <CardDescription className="text-lg text-zinc-500 group-hover:text-zinc-400 transition-colors duration-700 leading-relaxed font-medium">
                                            {dim.desc}
                                        </CardDescription>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
}
