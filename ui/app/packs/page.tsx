"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Package, Plus, ChevronRight, User, Palette, Sparkles, Binary } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { motion, Variants } from 'framer-motion';

const container: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.05 }
    }
};

const item: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

interface PackData {
    code: string;
    type: 'subject' | 'style';
    data: any;
}

export default function PacksPage() {
    const [subjectPacks, setSubjectPacks] = useState<PackData[]>([]);
    const [stylePacks, setStylePacks] = useState<PackData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadPacks() {
            try {
                // Load registry to get all pack codes
                const registryRes = await fetch('/api/registry');
                const registry = await registryRes.json();

                // Load all subject packs
                const subjectPackCodes = [
                    'SUB-SGPH_A_FR_ST',
                    'SUB-SGPH_B_AL_WV',
                    'SUB-SGPH_A_CF_WV',
                    'SUB-MBPH_A_FR_ST',
                    'SUB-MBPH_B_CF_WV',
                    'SUB-EMPH_A_SM_ST',
                    'SUB-EMPH_B_AL_PK',
                    'SUB-RSPH_A_SC_WV',
                    'SUB-RSPH_B_CF_ST',
                    'SUB-FDPH_A_FR_PK',
                    'SUB-FDPH_B_AL_ST'
                ];

                const subjectPacksData = await Promise.all(
                    subjectPackCodes.map(async (code) => {
                        try {
                            const res = await fetch(`/api/module?dim=SUB&code=${code}`);
                            const data = await res.json();
                            return { code, type: 'subject' as const, data };
                        } catch (e) {
                            return null;
                        }
                    })
                );

                // Load all style packs
                const stylePackCodes = [
                    'STY-DOOR_POCA_GOLD',
                    'STY-DOOR_SPORT',
                    'STY-DOOR_STREET',
                    'STY-DOOR_RESORT',
                    'STY-DOOR_ACTIVE',
                    'STY-BEACH_POCA',
                    'STY-BEACH_RESORT',
                    'STY-BEACH_ACTIVE',
                    'STY-JUNGLE_POCA',
                    'STY-JUNGLE_ACTIVE',
                    'STY-JUNGLE_STREET'
                ];

                const stylePacksData = await Promise.all(
                    stylePackCodes.map(async (code) => {
                        try {
                            const res = await fetch(`/api/module?dim=STY&code=${code}`);
                            const data = await res.json();
                            return { code, type: 'style' as const, data };
                        } catch (e) {
                            return null;
                        }
                    })
                );

                setSubjectPacks(subjectPacksData.filter(Boolean) as PackData[]);
                setStylePacks(stylePacksData.filter(Boolean) as PackData[]);
            } catch (error) {
                console.error('Error loading packs:', error);
            } finally {
                setLoading(false);
            }
        }

        loadPacks();
    }, []);

    function getPackDisplayName(code: string, type: 'subject' | 'style'): string {
        if (type === 'subject') {
            // Parse subject pack code: SUB-{FA}_{BT}_{HR}
            const parts = code.replace('SUB-', '').split('_');
            return `${parts[0]} • ${parts[1]} • ${parts[2]}`;
        } else {
            // Parse style pack code: STY-{SC}_{ST}
            const parts = code.replace('STY-', '').split('_');
            return `${parts[0]} • ${parts.slice(1).join('_')}`;
        }
    }

    function getPackTitle(code: string, type: 'subject' | 'style'): string {
        if (type === 'subject') {
            const parts = code.replace('SUB-', '').split('_');
            const fa = parts[0];
            if (fa.startsWith('SG')) return 'Soft Goddess';
            if (fa.startsWith('MB')) return 'Modern Bombshell';
            if (fa.startsWith('EM')) return 'Editorial Model';
            if (fa.startsWith('RS')) return 'Romantic Sweet';
            if (fa.startsWith('FD')) return 'Fitness Defined';
        } else {
            const parts = code.replace('STY-', '').split('_');
            const scene = parts[0];
            const outfit = parts.slice(1).join(' ');
            return `${scene} ${outfit}`;
        }
        return code;
    }

    if (loading) {
        return (
            <div className="space-y-24 pb-40">
                <div className="flex items-center justify-center h-96">
                    <div className="text-zinc-600 text-lg">Loading packs...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-24 pb-40">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
                <div className="space-y-10">
                    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/[0.03] border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl">
                        <Sparkles size={14} className="text-purple-500 fill-purple-500/20" />
                        Curated Collections
                    </div>
                    <div className="space-y-6">
                        <h1 className="text-9xl font-black tracking-[-0.05em] text-white leading-[0.85]">
                            Packs<span className="text-purple-500">.</span>
                        </h1>
                        <p className="text-zinc-500 text-2xl font-medium max-w-2xl leading-relaxed">
                            Standardized configurations for consistent prompt output. <br />
                            <span className="text-zinc-800">Accelerate your workflow with pre-validated parameter sets.</span>
                        </p>
                    </div>
                </div>
            </div>

            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 lg:grid-cols-2 gap-20"
            >
                {/* Subject Packs */}
                <motion.div variants={item} className="space-y-10">
                    <div className="flex items-center gap-4 px-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-600">Subject Neural Packs</h2>
                        <div className="text-xs text-zinc-700 font-mono">({subjectPacks.length})</div>
                    </div>
                    <div className="space-y-6">
                        {subjectPacks.map(pack => (
                            <Link key={pack.code} href={`/packs/subject/${pack.code}`}>
                                <Card className="bg-[#050505] border-white/5 hover:border-white/20 transition-all duration-700 group overflow-hidden cursor-pointer">
                                    <CardContent className="p-10 flex items-center justify-between">
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                                                    <User size={20} />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-mono text-zinc-700 font-bold uppercase tracking-widest">{pack.code}</p>
                                                    <h3 className="text-2xl font-black text-white group-hover:text-blue-500 transition-colors">{getPackTitle(pack.code, 'subject')}</h3>
                                                </div>
                                            </div>
                                            <p className="text-sm text-zinc-500 font-medium italic pl-1">"{getPackDisplayName(pack.code, 'subject')}"</p>
                                        </div>
                                        <div className="w-12 h-12 rounded-full border border-white/5 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-500">
                                            <ChevronRight size={24} />
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </motion.div>

                {/* Style Packs */}
                <motion.div variants={item} className="space-y-10">
                    <div className="flex items-center gap-4 px-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                        <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-600">Scene/Outfit Packs</h2>
                        <div className="text-xs text-zinc-700 font-mono">({stylePacks.length})</div>
                    </div>
                    <div className="space-y-6">
                        {stylePacks.map(pack => (
                            <Link key={pack.code} href={`/packs/style/${pack.code}`}>
                                <Card className="bg-[#050505] border-white/5 hover:border-white/20 transition-all duration-700 group overflow-hidden cursor-pointer">
                                    <CardContent className="p-10 flex items-center justify-between">
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                                                    <Palette size={20} />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-mono text-zinc-700 font-bold uppercase tracking-widest">{pack.code}</p>
                                                    <h3 className="text-2xl font-black text-white group-hover:text-purple-500 transition-colors">{getPackTitle(pack.code, 'style')}</h3>
                                                </div>
                                            </div>
                                            <p className="text-sm text-zinc-500 font-medium italic pl-1">"{getPackDisplayName(pack.code, 'style')}"</p>
                                        </div>
                                        <div className="w-12 h-12 rounded-full border border-white/5 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-500">
                                            <ChevronRight size={24} />
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
}
