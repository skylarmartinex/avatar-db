"use client";
import { useState } from 'react';
import { ShieldCheck, Loader2, AlertTriangle, CheckCircle2, Search, ArrowUpRight, Zap, Target, Activity, Database, Fingerprint, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export default function AuditPage() {
    const [output, setOutput] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState<boolean | null>(null);

    async function runLint() {
        setLoading(true);
        try {
            const res = await fetch('/api/lint', { method: 'POST' });
            const data = await res.json();
            setOutput(data.output);
            setSuccess(data.success);
        } catch (e) {
            setOutput("Database connection timeout or parsing error.");
            setSuccess(false);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="max-w-[1400px] mx-auto space-y-24 pb-48">
            <div className="flex flex-col 2xl:flex-row 2xl:items-end justify-between gap-16 border-b border-white/5 pb-20">
                <div className="space-y-12">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-3 px-5 py-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.4em]"
                    >
                        <ShieldCheck size={14} fill="currentColor" />
                        Governance Protocol Alpha
                    </motion.div>
                    <div className="space-y-8">
                        <h1 className="text-9xl font-black tracking-[-0.06em] text-white leading-[0.85]">
                            Audit<span className="text-emerald-500">.</span>
                        </h1>
                        <p className="text-zinc-500 text-3xl font-medium max-w-3xl leading-tight">
                            Execute deep-cycle diagnostics. <br />
                            <span className="text-zinc-800 italic">Verify module schema integrity and boundary constraints.</span>
                        </p>
                    </div>
                </div>

                <Button
                    size="lg"
                    onClick={runLint}
                    disabled={loading}
                    className="h-24 px-20 text-2xl rounded-[3rem] bg-white text-black font-black shadow-[0_30px_100px_rgba(255,255,255,0.05)] hover:scale-105 active:scale-95 transition-all"
                >
                    {loading ? (
                        <>
                            <Loader2 className="mr-5 animate-spin" size={32} />
                            Scanning...
                        </>
                    ) : (
                        <>
                            <Database className="mr-5" size={32} />
                            Perform Full Scan
                        </>
                    )}
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {[
                    { icon: Target, title: "Boundary Guard", desc: "Verifies style modules strictly respect identity anchors.", color: "blue" },
                    { icon: Fingerprint, title: "ID Lock Verification", desc: "Confirms all FA modules utilize standard immutability keys.", color: "purple" },
                    { icon: Lock, title: "Schema Protection", desc: "Validates JSON structure against strict allowed key matrix.", color: "emerald" },
                ].map((item, i) => (
                    <Card key={i} className="bg-[#030303] border-2 border-white/[0.03] rounded-[3rem] group hover:border-white/10 transition-all duration-700">
                        <CardContent className="p-10 space-y-8">
                            <div className={cn("p-5 rounded-3xl w-fit bg-zinc-900 border border-white/5 group-hover:bg-white group-hover:text-black transition-all duration-500 shadow-2xl")}>
                                <item.icon size={32} strokeWidth={1.5} />
                            </div>
                            <div className="space-y-3">
                                <h3 className="text-2xl font-black text-white tracking-tighter">{item.title}</h3>
                                <p className="text-base text-zinc-600 font-medium leading-relaxed italic">"{item.desc}"</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className={cn(
                "rounded-[4rem] border-2 border-white/[0.05] bg-[#020202] overflow-hidden shadow-[0_50px_150px_rgba(0,0,0,1)] transition-all duration-1000",
                success === false && "border-red-500/20 shadow-red-500/10",
                success === true && "border-emerald-500/20 shadow-emerald-500/10"
            )}>
                <div className="px-16 py-12 border-b border-white/[0.05] flex items-center justify-between bg-white/[0.01]">
                    <div className="flex items-center gap-6">
                        <div className={cn(
                            "w-3 h-3 rounded-full",
                            success === null ? "bg-zinc-900 animate-pulse" : success ? "bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.8)]" : "bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.8)]"
                        )} />
                        <span className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-700">System Trace Log</span>
                    </div>
                    <AnimatePresence>
                        {success === false && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                                className="flex items-center gap-3 text-red-500 text-[10px] font-black uppercase tracking-widest shadow-2xl"
                            >
                                <AlertTriangle size={16} />
                                Governance Failure
                            </motion.div>
                        )}
                        {success === true && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                                className="flex items-center gap-3 text-emerald-500 text-[10px] font-black uppercase tracking-widest shadow-2xl"
                            >
                                <CheckCircle2 size={16} />
                                Security Healthy
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="p-20 font-mono text-sm min-h-[600px] leading-8">
                    <AnimatePresence mode="wait">
                        {output ? (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                                className="space-y-10"
                            >
                                {output.split('\n').map((line, i) => {
                                    if (line.startsWith('ERROR:')) {
                                        const [_, meta, ...msg] = line.split(' ');
                                        return (
                                            <div key={i} className="flex gap-10 p-12 rounded-[3.5rem] bg-red-500/[0.01] border-2 border-red-500/10 group transition-all hover:bg-red-500/[0.03] shadow-2xl">
                                                <div className="p-4 rounded-2xl bg-red-500/10 text-red-500 shrink-0 h-fit">
                                                    <AlertTriangle size={24} />
                                                </div>
                                                <div className="space-y-4 overflow-hidden">
                                                    <p className="text-red-400 font-black tracking-tighter text-2xl font-sans">{meta}</p>
                                                    <p className="text-red-500/60 text-sm leading-relaxed font-bold italic">"{msg.join(' ')}"</p>
                                                </div>
                                            </div>
                                        );
                                    }
                                    return <div key={i} className="text-zinc-800 py-3 border-b border-white/[0.02] last:border-0 font-bold">{line}</div>;
                                })}
                            </motion.div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-zinc-900 gap-12 py-32">
                                <ShieldCheck size={120} className="opacity-5 stroke-[0.5px]" />
                                <div className="text-center space-y-6">
                                    <p className="font-black text-xs uppercase tracking-[1em] text-zinc-800">Standby</p>
                                    <p className="text-sm text-zinc-900 font-black italic max-w-[320px] leading-relaxed">Initiate deep diagnostic to visualize prompt database integrity.</p>
                                </div>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
