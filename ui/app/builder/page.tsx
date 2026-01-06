"use client";
import { useEffect, useState, useRef } from 'react';
import { Copy, Check, Info, Wand2, RefreshCw, Terminal, Activity, Cpu, Braces, MousePointerClick } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export default function BuilderPage() {
    const [registry, setRegistry] = useState<any>(null);
    const [selections, setSelections] = useState({
        ET: '', REGION: '', FA: '', BT: '', HR: '', SC: '', ST: '', v: '01', r: '01'
    });
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [copiedJson, setCopiedJson] = useState(false);
    const [copiedText, setCopiedText] = useState(false);
    const [copyError, setCopyError] = useState<string | null>(null);
    const [hoveredDim, setHoveredDim] = useState<string | null>(null);
    const jsonTextareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        fetch('/api/registry').then(res => res.json()).then(setRegistry);
    }, []);

    // Reset region when ethnicity changes
    useEffect(() => {
        setSelections(prev => ({ ...prev, REGION: '' }));
    }, [selections.ET]);

    async function handleBuild() {
        setLoading(true);
        setError(null);
        try {
            // Determine which region dimension to use
            const buildParams: any = {
                FA: selections.FA,
                BT: selections.BT,
                ET: selections.ET,
                HR: selections.HR,
                SC: selections.SC,
                ST: selections.ST,
                v: selections.v,
                r: selections.r
            };

            // Add region based on ethnicity
            if (selections.REGION) {
                if (selections.ET === 'PH') {
                    buildParams.PH_REGION = selections.REGION;
                } else if (selections.ET === 'VN') {
                    buildParams.VN_REGION = selections.REGION;
                }
            }

            const res = await fetch('/api/build', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(buildParams)
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

    // Bulletproof copy helper with fallback
    async function copyToClipboard(text: string): Promise<{ ok: boolean; method?: string; error?: string }> {
        console.log("copyToClipboard called with text length:", text.length);
        
        // Attempt modern clipboard API
        try {
            if (window.isSecureContext && navigator.clipboard?.writeText) {
                await navigator.clipboard.writeText(text);
                console.log("✅ Copied via clipboard API");
                return { ok: true, method: "clipboard" };
            }
        } catch (e) {
            console.warn("Clipboard API failed:", e);
        }

        // Fallback: hidden textarea + execCommand
        try {
            const ta = document.createElement("textarea");
            ta.value = text;
            ta.setAttribute("readonly", "");
            ta.style.position = "fixed";
            ta.style.left = "-9999px";
            ta.style.top = "-9999px";
            document.body.appendChild(ta);
            ta.focus();
            ta.select();
            ta.setSelectionRange(0, ta.value.length);
            const ok = document.execCommand("copy");
            document.body.removeChild(ta);
            if (!ok) throw new Error("execCommand copy returned false");
            console.log("✅ Copied via execCommand");
            return { ok: true, method: "execCommand" };
        } catch (e) {
            console.error("❌ All copy methods failed:", e);
            return { ok: false, error: String(e) };
        }
    }

    async function copyJsonToClipboard() {
        console.log("Copy JSON clicked");
        setCopyError(null);
        
        if (result?.prompt) {
            const jsonText = JSON.stringify(result.prompt, null, 2);
            const copyResult = await copyToClipboard(jsonText);
            
            if (copyResult.ok) {
                setCopiedJson(true);
                setTimeout(() => setCopiedJson(false), 2000);
            } else {
                setCopyError(`Copy failed: ${copyResult.error}`);
                setTimeout(() => setCopyError(null), 5000);
            }
        }
    }

    async function copyTextToClipboard() {
        console.log("Copy Text clicked");
        setCopyError(null);
        
        if (result?.prompt) {
            const jsonText = JSON.stringify(result.prompt, null, 2);
            const copyResult = await copyToClipboard(jsonText);
            
            if (copyResult.ok) {
                setCopiedText(true);
                setTimeout(() => setCopiedText(false), 2000);
            } else {
                setCopyError(`Copy failed: ${copyResult.error}`);
                setTimeout(() => setCopyError(null), 5000);
            }
        }
    }

    function selectAllJson() {
        console.log("Select All clicked");
        if (jsonTextareaRef.current) {
            jsonTextareaRef.current.focus();
            jsonTextareaRef.current.select();
        }
    }

    if (!registry) return (
        <div className="h-[70vh] flex flex-col items-center justify-center gap-10">
            <div className="relative">
                <div className="absolute inset-x-0 -bottom-10 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent blur-sm" />
                <p className="text-zinc-600 font-black tracking-[0.5em] text-[10px] uppercase animate-pulse">Initializing Synthesis Engine...</p>
            </div>
        </div>
    );

    // Get available regions based on selected ethnicity
    const getRegionOptions = () => {
        if (selections.ET === 'PH' && registry.PH_REGION) {
            return Object.entries(registry.PH_REGION)
                .filter(([, data]: [string, any]) => data.status !== 'deprecated')
                .map(([code, data]: [string, any]) => ({ code, label: data.label || code }));
        } else if (selections.ET === 'VN' && registry.VN_REGION) {
            return Object.entries(registry.VN_REGION)
                .filter(([, data]: [string, any]) => data.status !== 'deprecated')
                .map(([code, data]: [string, any]) => ({ code, label: data.label || code }));
        }
        return [];
    };

    const regionOptions = getRegionOptions();
    const isRegionEnabled = regionOptions.length > 0;

    // Left column parameters
    const LEFT_PARAMS = [
        { code: 'ET', label: 'Ethnicity', placeholder: 'Select ethnicity', registryKey: 'ET' },
        { code: 'REGION', label: 'Region', placeholder: 'Select region', registryKey: null, isRegion: true },
        { code: 'HR', label: 'Hair Style', placeholder: 'Select hair style', registryKey: 'HR' },
        { code: 'SC', label: 'Background', placeholder: 'Select background', registryKey: 'SC' }
    ];

    // Right column parameters
    const RIGHT_PARAMS = [
        { code: 'FA', label: 'Face Archetype', placeholder: 'Select face type', registryKey: 'FA' },
        { code: 'BT', label: 'Body Type', placeholder: 'Select body type', registryKey: 'BT' },
        { code: 'ST', label: 'Outfit', placeholder: 'Select outfit', registryKey: 'ST' }
    ];

    const renderParameter = (param: any) => {
        const selectedCode = selections[param.code as keyof typeof selections];
        
        // Special handling for Region
        if (param.isRegion) {
            const metadata = selectedCode && isRegionEnabled ? 
                (selections.ET === 'PH' ? registry.PH_REGION?.[selectedCode] : registry.VN_REGION?.[selectedCode]) : null;

            return (
                <div key={param.code} className={cn("space-y-3", !isRegionEnabled && "opacity-40")}>
                    <div className="flex items-center gap-2 px-1">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-600">
                            {param.label}
                        </label>
                        {metadata && (
                            <div 
                                className="relative group/info"
                                onMouseEnter={() => setHoveredDim(param.code)}
                                onMouseLeave={() => setHoveredDim(null)}
                            >
                                <Info size={12} className="text-zinc-700 hover:text-blue-500 cursor-help transition-colors" />
                                {hoveredDim === param.code && (
                                    <div className="absolute left-0 top-6 z-50 w-72 p-4 bg-zinc-900 border border-white/10 rounded-xl shadow-2xl">
                                        <p className="text-xs font-bold text-white mb-1">{metadata.label}</p>
                                        <p className="text-[11px] text-zinc-500 leading-relaxed italic">"{metadata.description}"</p>
                                        <div className="mt-2 px-2 py-1 bg-white/5 rounded text-[10px] font-mono text-zinc-600">{selectedCode}</div>
                                    </div>
                                )}
                            </div>
                        )}
                        {selectedCode && isRegionEnabled && <div className="w-1 h-1 rounded-full bg-blue-500 ml-auto" />}
                    </div>
                    <select
                        className="w-full bg-[#030303] border border-white/10 px-4 py-3 rounded-xl appearance-none focus:border-blue-500/50 outline-none transition-all text-sm font-semibold text-white hover:border-white/20 disabled:cursor-not-allowed"
                        value={selectedCode}
                        onChange={e => setSelections({ ...selections, [param.code]: e.target.value })}
                        disabled={!isRegionEnabled}
                    >
                        <option value="" className="text-zinc-600">
                            {isRegionEnabled ? param.placeholder : 'Select ethnicity first'}
                        </option>
                        {regionOptions.map(({ code, label }) => (
                            <option key={code} value={code}>{label}</option>
                        ))}
                    </select>
                </div>
            );
        }

        // Standard parameter
        const metadata = selectedCode && param.registryKey ? registry[param.registryKey]?.[selectedCode] : null;

        return (
            <div key={param.code} className="space-y-3">
                <div className="flex items-center gap-2 px-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-600">
                        {param.label}
                    </label>
                    {metadata && (
                        <div 
                            className="relative group/info"
                            onMouseEnter={() => setHoveredDim(param.code)}
                            onMouseLeave={() => setHoveredDim(null)}
                        >
                            <Info size={12} className="text-zinc-700 hover:text-blue-500 cursor-help transition-colors" />
                            {hoveredDim === param.code && (
                                <div className="absolute left-0 top-6 z-50 w-72 p-4 bg-zinc-900 border border-white/10 rounded-xl shadow-2xl">
                                    <p className="text-xs font-bold text-white mb-1">{metadata.label}</p>
                                    <p className="text-[11px] text-zinc-500 leading-relaxed italic">"{metadata.description}"</p>
                                    <div className="mt-2 px-2 py-1 bg-white/5 rounded text-[10px] font-mono text-zinc-600">{selectedCode}</div>
                                </div>
                            )}
                        </div>
                    )}
                    {selectedCode && <div className="w-1 h-1 rounded-full bg-blue-500 ml-auto" />}
                </div>
                <select
                    className="w-full bg-[#030303] border border-white/10 px-4 py-3 rounded-xl appearance-none focus:border-blue-500/50 outline-none transition-all text-sm font-semibold text-white hover:border-white/20"
                    value={selectedCode}
                    onChange={e => setSelections({ ...selections, [param.code]: e.target.value })}
                >
                    <option value="" className="text-zinc-600">{param.placeholder}</option>
                    {param.registryKey && Object.entries(registry[param.registryKey] || {})
                        .filter(([, data]: [string, any]) => data.status !== 'deprecated')
                        .map(([code, data]: [string, any]) => (
                            <option key={code} value={code}>
                                {data.label || code}
                            </option>
                        ))}
                </select>
            </div>
        );
    };

    // Check if all required parameters are selected
    const requiredParams = ['ET', 'FA', 'BT', 'HR', 'SC', 'ST'];
    const allRequiredSelected = requiredParams.every(p => selections[p as keyof typeof selections]);

    return (
        <div className="max-w-[1600px] mx-auto space-y-20 pb-48">
            {/* Compact Header */}
            <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-12 pb-12 border-b border-white/5">
                <div className="space-y-8">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-3 px-5 py-2 rounded-2xl bg-white text-black text-[10px] font-black uppercase tracking-[0.3em] shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                    >
                        <Activity size={14} fill="currentColor" />
                        Live Composer v4.3
                    </motion.div>
                    <div className="space-y-4">
                        <h1 className="text-8xl font-black tracking-[-0.05em] text-white leading-[0.85]">
                            Builder<span className="text-blue-500">.</span>
                        </h1>
                        <p className="text-zinc-500 text-xl font-medium max-w-2xl leading-relaxed">
                            Fast parametric prompt assembly. <span className="text-zinc-700">Select, assemble, copy.</span>
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-14 px-8 rounded-2xl text-zinc-500 hover:text-white"
                        onClick={() => setSelections({ ET: '', REGION: '', FA: '', BT: '', HR: '', SC: '', ST: '', v: '01', r: '01' })}
                    >
                        <RefreshCw size={16} className="mr-2" />
                        Clear
                    </Button>
                    <Button
                        size="sm"
                        className="h-14 px-12 rounded-2xl bg-white text-black hover:scale-105 shadow-[0_10px_50px_rgba(255,255,255,0.1)] font-black text-lg tracking-tight"
                        onClick={handleBuild}
                        disabled={loading || !allRequiredSelected}
                    >
                        {loading ? <Cpu className="animate-spin mr-3" size={20} /> : <Wand2 className="mr-3" size={20} fill="currentColor" />}
                        {loading ? "Assembling..." : "Assemble"}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-16">
                {/* Two-Column Parameter Grid */}
                <div className="xl:col-span-7 space-y-12">
                    <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                        {/* Left Column */}
                        <div className="space-y-6">
                            {LEFT_PARAMS.map(renderParameter)}
                        </div>

                        {/* Right Column */}
                        <div className="space-y-6">
                            {RIGHT_PARAMS.map(renderParameter)}
                        </div>
                    </div>

                    {/* Compact System Parameters */}
                    <div className="pt-8 border-t border-white/5">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-700 px-1">Version</label>
                                <input
                                    type="text"
                                    className="w-full bg-black border border-white/10 px-4 py-3 rounded-xl text-sm font-semibold text-white focus:border-blue-500/50 transition-all outline-none"
                                    value={selections.v}
                                    onChange={e => setSelections({ ...selections, v: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-700 px-1">Run ID</label>
                                <input
                                    type="text"
                                    className="w-full bg-black border border-white/10 px-4 py-3 rounded-xl text-sm font-semibold text-white focus:border-blue-500/50 transition-all outline-none"
                                    value={selections.r}
                                    onChange={e => setSelections({ ...selections, r: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Output Panel */}
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

                                            {copyError && (
                                                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                                                    <p className="text-xs text-red-400 font-medium">{copyError}</p>
                                                </div>
                                            )}

                                            <div className="space-y-6">
                                                <div className="flex items-center justify-between px-2">
                                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-800">Actions</span>
                                                </div>
                                                <div className="grid grid-cols-3 gap-3">
                                                    <button
                                                        onClick={copyJsonToClipboard}
                                                        className="flex items-center justify-center gap-2 px-4 py-4 bg-blue-500 hover:bg-blue-400 rounded-2xl text-xs font-black text-white transition-all shadow-lg"
                                                    >
                                                        {copiedJson ? <Check size={14} /> : <Braces size={14} />}
                                                        {copiedJson ? 'Copied!' : 'Copy'}
                                                    </button>
                                                    <button
                                                        onClick={selectAllJson}
                                                        className="flex items-center justify-center gap-2 px-4 py-4 bg-zinc-800 hover:bg-zinc-700 rounded-2xl text-xs font-black text-white transition-all shadow-lg"
                                                    >
                                                        <MousePointerClick size={14} />
                                                        Select
                                                    </button>
                                                    <button
                                                        onClick={copyTextToClipboard}
                                                        className="flex items-center justify-center gap-2 px-4 py-4 bg-zinc-800 hover:bg-zinc-700 rounded-2xl text-xs font-black text-white transition-all shadow-lg"
                                                    >
                                                        {copiedText ? <Check size={14} /> : <Copy size={14} />}
                                                        Text
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="space-y-6 flex-1 flex flex-col min-h-0">
                                                <div className="flex items-center justify-between px-2">
                                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-800">Prompt JSON</span>
                                                </div>
                                                <div className="flex-1 bg-black border-2 border-white/5 rounded-[3.5rem] p-10 overflow-auto shadow-inner relative group/code custom-scrollbar">
                                                    <textarea
                                                        ref={jsonTextareaRef}
                                                        readOnly
                                                        className="w-full h-full bg-transparent text-xs font-mono text-zinc-500 leading-8 outline-none resize-none"
                                                        value={JSON.stringify(result.prompt, null, 2)}
                                                    />
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
                                                <p className="text-sm max-w-[280px] leading-relaxed italic text-zinc-800 font-bold">Select all parameters and click "Assemble" to generate your prompt.</p>
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
