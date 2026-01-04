"use client";
import { useEffect, useState } from 'react';
import { Play, Copy, Check, Info, Wand2, RefreshCw, Layers, Sparkles, Terminal, Activity, ChevronDown, Cpu, Braces } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export default function BuilderPage() {
    const [registry, setRegistry] = useState<any>(null);
    const [selections, setSelections] = useState({
        FA: '', BT: '', ET: '', HR: '', SC: '', ST: '', v: '01', r: '01'
    });
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [copiedJson, setCopiedJson] = useState(false);
    const [copiedText, setCopiedText] = useState(false);

    useEffect(() => {
        fetch('/api/registry').then(res => res.json()).then(setRegistry);
    }, []);

    async function handleBuild() {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch('/api/build', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(selections)
            });
            const data = await res.json();

            if (data.error) {
                setError(data.error);
                setResult(null);
            } else {
                setResult(data);
            }
        } catch (e) {
            console.error(e);
            setError('Failed to assemble prompt. Please try again.');
            setResult(null);
        } finally {
            setLoading(false);
        }
    }

    function copyJsonToClipboard() {
        if (result?.promptContent) {
            navigator.clipboard.writeText(JSON.stringify(result.promptContent, null, 2));
            setCopiedJson(true);
            setTimeout(() => setCopiedJson(false), 2000);
        }
    }

    function copyTextToClipboard() {
        if (result?.promptContent) {
            // Flatten the prompt into readable text
            const flattenedText = flattenPromptToText(result.promptContent);
            navigator.clipboard.writeText(flattenedText);
            setCopiedText(true);
            setTimeout(() => setCopiedText(false), 2000);
        }
    }

    function flattenPromptToText(prompt: any): string {
        // Convert the structured prompt into a readable text format
        const parts = [];

        if (prompt.subject) parts.push(`Subject: ${prompt.subject}`);
        if (prompt.identity) parts.push(`Identity: ${prompt.identity}`);
        if (prompt.body) parts.push(`Body: ${prompt.body}`);
        if (prompt.hair) parts.push(`Hair: ${prompt.hair}`);
        if (prompt.background) parts.push(`Background: ${prompt.background}`);
        if (prompt.outfit) parts.push(`Outfit: ${prompt.outfit}`);
        if (prompt.negative) parts.push(`Negative: ${prompt.negative}`);

        return parts.join('\n');
    }

    if (!registry) return (
        <div className="h-[70vh] flex flex-col items-center justify-center gap-10">
            <div className="relative">
                <div className="absolute inset-x-0 -bottom-10 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent blur-sm" />
                <p className="text-zinc-600 font-black tracking-[0.5em] text-[10px] uppercase animate-pulse">Initializing Synthesis Engine...</p>
            </div>
        </div>
    );

    const DIMS = [
        { code: 'ET', label: 'Ethnicity' },
        { code: 'FA', label: 'Face Archetype' },
        { code: 'BT', label: 'Body Type' },
        { code: 'HR', label: 'Hair Style' },
        { code: 'SC', label: 'Background / Scene' },
        { code: 'ST', label: 'Outfit' }
    ];

    return (
        <div className="max-w-[1600px] mx-auto space-y-24 pb-48">
            {/* Dynamic Header */}
            <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-16 pb-16 border-b border-white/5">
                <div className="space-y-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-3 px-5 py-2 rounded-2xl bg-white text-black text-[10px] font-black uppercase tracking-[0.3em] shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                    >
                        <Activity size={14} fill="currentColor" />
                        Live Composer v4.2
                    </motion.div>
                    <div className="space-y-6">
                        <h1 className="text-9xl font-black tracking-[-0.05em] text-white leading-[0.85]">
                            Builder<span className="text-blue-500">.</span>
                        </h1>
                        <p className="text-zinc-500 text-2xl font-medium max-w-2xl leading-relaxed">
                            Synthesize high-precision parametric manifests. <br />
                            <span className="text-zinc-700">Deterministic identity through controlled mutation.</span>
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <Button
                        variant="ghost"
                        size="lg"
                        className="h-20 px-10 rounded-3xl text-zinc-500 hover:text-white"
                        onClick={() => setSelections({ FA: '', BT: '', ET: '', HR: '', SC: '', ST: '', v: '01', r: '01' })}
                    >
                        <RefreshCw size={20} className="mr-3" />
                        Clear
                    </Button>
                    <Button
                        size="lg"
                        className="h-20 px-16 rounded-[2.5rem] bg-white text-black hover:scale-105 shadow-[0_10px_50px_rgba(255,255,255,0.1)] font-black text-xl tracking-tighter"
                        onClick={handleBuild}
                        disabled={loading || !DIMS.every(d => selections[d.code as keyof typeof selections])}
                    >
                        {loading ? <Cpu className="animate-spin mr-4" size={24} /> : <Wand2 className="mr-4" size={24} fill="currentColor" />}
                        {loading ? "Synthesizing..." : "Assemble Prompt"}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-20">
                {/* Selection Matrix */}
                <div className="xl:col-span-7 space-y-16">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-20">
                        {DIMS.map(dim => {
                            const selectedCode = selections[dim.code as keyof typeof selections];
                            const metadata = selectedCode ? registry[dim.code]?.[selectedCode] : null;

                            return (
                                <div key={dim.code} className="space-y-8 group">
                                    <div className="flex items-center justify-between px-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-700 group-hover:text-blue-500 transition-colors">
                                            {dim.label}
                                        </label>
                                        {selectedCode && (
                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)] animate-pulse" />
                                        )}
                                    </div>
                                    <div className="relative">
                                        <select
                                            className="w-full bg-[#030303] border-2 border-white/5 p-7 rounded-[2rem] appearance-none focus:border-blue-500/50 outline-none transition-all text-lg font-black text-white group-hover:border-white/10 shadow-2xl"
                                            value={selectedCode}
                                            onChange={e => setSelections({ ...selections, [dim.code]: e.target.value })}
                                        >
                                            <option value="">Param Null</option>
                                            {Object.entries(registry[dim.code] || {})
                                                .filter(([, data]: [string, any]) => data.status !== 'deprecated')
                                                .map(([code, data]: [string, any]) => (
                                                    <option key={code} value={code}>
                                                        {data.label || code}
                                                    </option>
                                                ))}
                                        </select>
                                        <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-700">
                                            <ChevronDown size={22} />
                                        </div>
                                    </div>

                                    <AnimatePresence mode="wait">
                                        {metadata ? (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10, filter: 'blur(5px)' }}
                                                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                                                exit={{ opacity: 0, y: -10, filter: 'blur(5px)' }}
                                                className="p-8 rounded-[2.5rem] bg-zinc-900/40 border border-white/[0.05] space-y-4 shadow-sm"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xl font-black text-white">{metadata.label}</span>
                                                    <span className="px-2 py-0.5 rounded bg-white/[0.05] text-[10px] font-mono text-zinc-500">{selectedCode}</span>
                                                </div>
                                                <p className="text-sm text-zinc-500 leading-relaxed font-medium italic">"{metadata.description}"</p>
                                            </motion.div>
                                        ) : (
                                            <div className="h-[120px] rounded-[2.5rem] border-2 border-dashed border-white/[0.02] flex items-center justify-center bg-transparent">
                                                <span className="text-[10px] font-black text-zinc-800 uppercase tracking-[0.5em]">Input Awaiting</span>
                                            </div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            );
                        })}
                    </div>

                    <div className="pt-20">
                        <div className="bg-[#050505] p-12 rounded-[4rem] border border-white/[0.03] space-y-12">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-px bg-zinc-800" />
                                <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-600">Global Headers</h3>
                            </div>
                            <div className="grid grid-cols-2 gap-12">
                                <div className="space-y-4">
                                    <p className="text-[10px] text-zinc-800 font-black uppercase tracking-widest pl-2">System Version</p>
                                    <input
                                        type="text"
                                        className="w-full bg-black border-2 border-white/5 p-6 rounded-3xl text-sm font-black text-white focus:border-blue-500/50 transition-all outline-none"
                                        value={selections.v}
                                        onChange={e => setSelections({ ...selections, v: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-4">
                                    <p className="text-[10px] text-zinc-800 font-black uppercase tracking-widest pl-2">Sequence ID</p>
                                    <input
                                        type="text"
                                        className="w-full bg-black border-2 border-white/5 p-6 rounded-3xl text-sm font-black text-white focus:border-blue-500/50 transition-all outline-none"
                                        value={selections.r}
                                        onChange={e => setSelections({ ...selections, r: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Console Hub */}
                <div className="xl:col-span-5 relative">
                    <div className="sticky top-40">
                        <Card className="rounded-[4rem] bg-[#020202] border-white/[0.05] shadow-[0_40px_100px_rgba(0,0,0,1)] min-h-[750px] flex flex-col group/terminal relative overflow-hidden">
                            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                            <div className="p-12 border-b border-white/5 flex items-center justify-between">
                                <div className="flex items-center gap-6">
                                    <div className={cn("w-3 h-3 rounded-full", result ? "bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.8)]" : error ? "bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.8)]" : "bg-zinc-900")} />
                                    <h2 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500 flex items-center gap-4">
                                        <Terminal size={14} className="text-zinc-700" />
                                        Assembled Prompt
                                    </h2>
                                </div>
                                {result && (
                                    <div className="px-4 py-1 rounded-full bg-blue-500 group-hover:bg-blue-400 transition-colors text-[9px] font-black text-white uppercase tracking-widest shadow-2xl">
                                        Ready
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 p-12 overflow-hidden flex flex-col gap-12">
                                <AnimatePresence mode="wait">
                                    {error ? (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.98 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="flex-1 flex flex-col items-center justify-center gap-8 py-20"
                                        >
                                            <div className="w-32 h-32 rounded-[3.5rem] bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                                                <Info size={48} className="text-red-500" />
                                            </div>
                                            <div className="text-center space-y-4 max-w-md">
                                                <h3 className="font-black text-xs uppercase tracking-[0.6em] text-red-500">Assembly Failed</h3>
                                                <p className="text-sm leading-relaxed text-zinc-500 font-medium">{error}</p>
                                            </div>
                                        </motion.div>
                                    ) : result ? (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.98 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="space-y-12 flex-1 flex flex-col"
                                        >
                                            <div className="space-y-6">
                                                <div className="flex items-center justify-between px-2">
                                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-800">Canonical ID</span>
                                                </div>
                                                <div className="p-8 bg-black border-2 border-white/5 rounded-[2.5rem] font-mono text-[11px] text-zinc-400 break-all leading-relaxed shadow-inner">
                                                    {result.canonical_id}
                                                </div>
                                            </div>

                                            <div className="space-y-6">
                                                <div className="flex items-center justify-between px-2">
                                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-800">Actions</span>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <button
                                                        onClick={copyJsonToClipboard}
                                                        className="flex items-center justify-center gap-3 px-6 py-4 bg-blue-500 hover:bg-blue-400 rounded-2xl text-xs font-black text-white transition-all shadow-lg"
                                                    >
                                                        {copiedJson ? <Check size={16} /> : <Braces size={16} />}
                                                        {copiedJson ? 'Copied!' : 'Copy JSON'}
                                                    </button>
                                                    <button
                                                        onClick={copyTextToClipboard}
                                                        className="flex items-center justify-center gap-3 px-6 py-4 bg-zinc-800 hover:bg-zinc-700 rounded-2xl text-xs font-black text-white transition-all shadow-lg"
                                                    >
                                                        {copiedText ? <Check size={16} /> : <Copy size={16} />}
                                                        {copiedText ? 'Copied!' : 'Copy Text'}
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="space-y-6 flex-1 flex flex-col min-h-0">
                                                <div className="flex items-center justify-between px-2">
                                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-800">Prompt JSON</span>
                                                </div>
                                                <div className="flex-1 bg-black border-2 border-white/5 rounded-[3.5rem] p-10 overflow-auto shadow-inner relative group/code custom-scrollbar">
                                                    <pre className="text-xs font-mono text-zinc-500 leading-8">
                                                        {JSON.stringify(result.promptContent, null, 2)}
                                                    </pre>
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none h-32 bottom-0 top-auto opacity-80" />
                                                </div>
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="flex-1 flex flex-col items-center justify-center gap-10 py-20"
                                        >
                                            <div className="w-32 h-32 rounded-[3.5rem] bg-zinc-900/30 border border-white/[0.05] flex items-center justify-center rotate-12">
                                                <Cpu size={48} className="text-zinc-800 -rotate-12" />
                                            </div>
                                            <div className="text-center space-y-4">
                                                <h3 className="font-black text-xs uppercase tracking-[0.6em] text-zinc-700">Awaiting Assembly</h3>
                                                <p className="text-sm max-w-[280px] leading-relaxed italic text-zinc-800 font-bold">Select all parameters and click "Assemble Prompt" to generate your prompt.</p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
