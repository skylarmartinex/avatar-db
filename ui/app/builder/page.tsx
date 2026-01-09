"use client";
import { useEffect, useState, useRef } from 'react';
import { Copy, Check, Info, Wand2, RefreshCw, Terminal, Activity, Cpu, Braces, MousePointerClick, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export default function BuilderPage() {
    const [registry, setRegistry] = useState<any>(null);
    const [selectedBackground, setSelectedBackground] = useState('DOORWAY_GOLD');
    const [selectedOutfit, setSelectedOutfit] = useState('TRIBAL_BIKINI');
    const [selectedHair, setSelectedHair] = useState('GOLD');
    const [selectedAppearance, setSelectedAppearance] = useState('MEDIUM_TAN_OLIVE');

    // Granular Controls
    const [hairTexture, setHairTexture] = useState('Loose beach waves');
    const [hairLength, setHairLength] = useState('Long');
    const [hairStyleMode, setHairStyleMode] = useState('Down');
    const [hairPart, setHairPart] = useState('Center part');
    const [hairBangs, setHairBangs] = useState('None');
    const [hairFinish, setHairFinish] = useState('Fresh salon blowout');

    const [skinBase, setSkinBase] = useState('Medium-tan');
    const [skinUndertone, setSkinUndertone] = useState('Olive');
    const [skinFinish, setSkinFinish] = useState('Dewy');

    const [hairBaseColor, setHairBaseColor] = useState('Espresso brunette');
    const [highlightsEnabled, setHighlightsEnabled] = useState(true);

    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [copiedJson, setCopiedJson] = useState(false);
    const [copiedText, setCopiedText] = useState(false);
    const [copyError, setCopyError] = useState<string | null>(null);
    const jsonTextareaRef = useRef<HTMLTextAreaElement>(null);

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
                body: JSON.stringify({
                    BASE: 'BASE',
                    SUBJECT_TYPE: 'TYPE',
                    FACE: 'GOLD',
                    BODY: 'GOLD',
                    HAIR: selectedHair,
                    ETHNICITY: 'GOLD',
                    SKIN: 'GOLD',
                    APPEARANCE: selectedAppearance,
                    OUTFIT: selectedOutfit,
                    POSE: 'GOLD',
                    BACKGROUND: selectedBackground,
                    v: '01',
                    r: '01',
                    overrides: {
                        subject: {
                            hair: {
                                texture: hairTexture,
                                length: hairLength,
                                style_mode: hairStyleMode,
                                part: hairPart,
                                bangs: hairBangs,
                                finish: hairFinish
                            }
                        },
                        appearance: {
                            skin_tone: {
                                base: skinBase,
                                undertone: skinUndertone,
                                complexion_finish: skinFinish
                            },
                            hair_color: {
                                base_color: hairBaseColor,
                                highlights: { enabled: highlightsEnabled }
                            }
                        }
                    }
                })
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

    async function copyToClipboard(text: string): Promise<{ ok: boolean; method?: string; error?: string }> {
        console.log("copyToClipboard called with text length:", text.length);

        try {
            if (window.isSecureContext && navigator.clipboard?.writeText) {
                await navigator.clipboard.writeText(text);
                console.log("✅ Copied via clipboard API");
                return { ok: true, method: "clipboard" };
            }
        } catch (e) {
            console.warn("Clipboard API failed:", e);
        }

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

        if (result?.prompt?.metadata?.rendered_prompt) {
            const copyResult = await copyToClipboard(result.prompt.metadata.rendered_prompt);

            if (copyResult.ok) {
                setCopiedText(true);
                setTimeout(() => setCopiedText(false), 2000);
            } else {
                setCopyError(`Copy failed: ${copyResult.error}`);
                setTimeout(() => setCopyError(null), 5000);
            }
        } else if (result?.prompt) {
            // Fallback to JSON if rendered prompt is missing
            const jsonText = JSON.stringify(result.prompt, null, 2);
            const copyResult = await copyToClipboard(jsonText);
            if (copyResult.ok) {
                setCopiedText(true);
                setTimeout(() => setCopiedText(false), 2000);
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

    const backgrounds = registry.BACKGROUND ? Object.entries(registry.BACKGROUND)
        .filter(([, data]: [string, any]) => data.status === 'active')
        .map(([code, data]: [string, any]) => ({ code, label: data.label, description: data.description }))
        : [];

    const outfits = registry.OUTFIT ? Object.entries(registry.OUTFIT)
        .filter(([, data]: [string, any]) => data.status === 'active')
        .map(([code, data]: [string, any]) => ({ code, label: data.label, description: data.description }))
        : [];

    const hairPresets = registry.HAIR ? Object.entries(registry.HAIR)
        .filter(([, data]: [string, any]) => data.status === 'active')
        .map(([code, data]: [string, any]) => ({ code, label: data.label, description: data.description }))
        : [];

    const appearancePresets = registry.APPEARANCE ? Object.entries(registry.APPEARANCE)
        .filter(([, data]: [string, any]) => data.status === 'active')
        .map(([code, data]: [string, any]) => ({ code, label: data.label, description: data.description }))
        : [];

    const ENUMS = {
        textures: ["Pin-straight, glass-smooth", "Loose beach waves", "Defined curls (2C–3A)", "Spiral curls (3B–3C)", "Wet-look strands"],
        lengths: ["Short", "Medium", "Long", "Extra-long"],
        styleModes: ["Down", "Half-up", "High ponytail", "Slick-back ponytail", "Braids"],
        parts: ["Center part", "Side part", "No visible part"],
        bangs: ["None", "Curtain bangs", "Blunt bangs"],
        hairFinishes: ["Fresh salon blowout", "Day-two texture", "High-shine editorial", "Matte natural"],
        skinBases: ["Porcelain", "Ivory", "Fair", "Light", "Light-medium", "Medium", "Medium-tan", "Tan", "Deep"],
        undertones: ["Warm", "Cool", "Neutral", "Olive", "Golden"],
        skinFinishes: ["Matte", "Natural", "Dewy"],
        hairColors: ["Jet black", "Soft black", "Espresso brunette", "Honey brown", "Auburn", "Copper", "Honey blonde", "Ash blonde", "Platinum blonde"]
    };

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
                        Gold Standard Mode
                    </motion.div>
                    <div className="space-y-4">
                        <h1 className="text-8xl font-black tracking-[-0.05em] text-white leading-[0.85]">
                            Builder<span className="text-blue-500">.</span>
                        </h1>
                        <p className="text-zinc-500 text-xl font-medium max-w-2xl leading-relaxed">
                            Gold Avatar. <span className="text-zinc-700">Background + Character Modifiers.</span>
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-14 px-8 rounded-2xl text-zinc-500 hover:text-white"
                        onClick={() => {
                            setSelectedBackground('DOORWAY_GOLD');
                            setSelectedOutfit('TRIBAL_BIKINI');
                            setSelectedHair('GOLD');
                            setSelectedAppearance('PORCELAIN_COOL');
                        }}
                    >
                        <RefreshCw size={16} className="mr-2" />
                        Reset
                    </Button>
                    <Button
                        size="sm"
                        className="h-14 px-12 rounded-2xl bg-white text-black hover:scale-105 shadow-[0_10px_50px_rgba(255,255,255,0.1)] font-black text-lg tracking-tight"
                        onClick={handleBuild}
                        disabled={loading}
                    >
                        {loading ? <Cpu className="animate-spin mr-3" size={20} /> : <Wand2 className="mr-3" size={20} fill="currentColor" />}
                        {loading ? "Assembling..." : "Assemble"}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-16">
                {/* Simplified Parameter Panel */}
                <div className="xl:col-span-7 space-y-12">
                    {/* Locked Preset */}
                    <div className="p-8 bg-zinc-900/50 border border-white/10 rounded-3xl">
                        <div className="flex items-center gap-4 mb-6">
                            <Lock size={20} className="text-yellow-500" />
                            <h2 className="text-lg font-black uppercase tracking-wider text-white">Gold Avatar (Locked)</h2>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-blue-500" />
                                <span className="text-zinc-500">Face: <span className="text-white font-semibold">Soft Goddess</span></span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-blue-500" />
                                <span className="text-zinc-500">Body: <span className="text-white font-semibold">Ripped Athletic</span></span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-blue-500" />
                                <span className="text-zinc-500">Ethnicity: <span className="text-white font-semibold">Filipino</span></span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-blue-500" />
                                <span className="text-zinc-500">Pose: <span className="text-white font-semibold">Power Pose</span></span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-blue-500" />
                                <span className="text-zinc-500">Base: <span className="text-white font-semibold">Gold Standard</span></span>
                            </div>
                        </div>
                    </div>

                    {/* Variable Selectors */}
                    <div className="space-y-8">
                        {/* Outfit Selector */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 px-1">
                                <label className="text-sm font-bold uppercase tracking-wider text-white">
                                    Outfit
                                </label>
                                <div className="w-1 h-1 rounded-full bg-green-500" />
                            </div>
                            <select
                                className="w-full bg-[#030303] border border-white/10 px-6 py-4 rounded-2xl appearance-none focus:border-blue-500/50 outline-none transition-all text-base font-semibold text-white hover:border-white/20"
                                value={selectedOutfit}
                                onChange={e => setSelectedOutfit(e.target.value)}
                            >
                                {outfits.map(({ code, label }) => (
                                    <option key={code} value={code}>{label}</option>
                                ))}
                            </select>
                            {outfits.find(o => o.code === selectedOutfit) && (
                                <p className="text-xs text-zinc-600 italic px-1">
                                    {outfits.find(o => o.code === selectedOutfit)?.description}
                                </p>
                            )}
                        </div>

                        {/* Hair System */}
                        <div className="p-8 bg-black/40 border border-white/5 rounded-[2.5rem] space-y-10">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-8 bg-blue-500 rounded-full" />
                                    <h3 className="text-xl font-black uppercase tracking-widest text-white">Hair Blueprint</h3>
                                </div>
                                <select
                                    className="bg-zinc-900 border border-white/10 px-4 py-2 rounded-xl text-xs font-bold text-zinc-400 outline-none"
                                    value={selectedHair}
                                    onChange={e => setSelectedHair(e.target.value)}
                                >
                                    {hairPresets.map(({ code, label }) => (
                                        <option key={code} value={code}>{label} Preset</option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Texture</label>
                                    <select
                                        className="w-full bg-zinc-900 border border-white/5 px-6 py-4 rounded-2xl text-sm font-bold text-white outline-none focus:border-blue-500/50 transition-all"
                                        value={hairTexture}
                                        onChange={e => setHairTexture(e.target.value)}
                                    >
                                        {ENUMS.textures.map(t => <option key={t} value={t}>{t}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Length</label>
                                    <select
                                        className="w-full bg-zinc-900 border border-white/5 px-6 py-4 rounded-2xl text-sm font-bold text-white outline-none focus:border-blue-500/50 transition-all"
                                        value={hairLength}
                                        onChange={e => setHairLength(e.target.value)}
                                    >
                                        {ENUMS.lengths.map(l => <option key={l} value={l}>{l}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Style Mode</label>
                                    <select
                                        className="w-full bg-zinc-900 border border-white/5 px-6 py-4 rounded-2xl text-sm font-bold text-white outline-none focus:border-blue-500/50 transition-all"
                                        value={hairStyleMode}
                                        onChange={e => setHairStyleMode(e.target.value)}
                                    >
                                        {ENUMS.styleModes.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Finish</label>
                                    <select
                                        className="w-full bg-zinc-900 border border-white/5 px-6 py-4 rounded-2xl text-sm font-bold text-white outline-none focus:border-blue-500/50 transition-all"
                                        value={hairFinish}
                                        onChange={e => setHairFinish(e.target.value)}
                                    >
                                        {ENUMS.hairFinishes.map(f => <option key={f} value={f}>{f}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Appearance System */}
                        <div className="p-8 bg-black/40 border border-white/5 rounded-[2.5rem] space-y-10">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-8 bg-amber-500 rounded-full" />
                                    <h3 className="text-xl font-black uppercase tracking-widest text-white">Character Finish</h3>
                                </div>
                                <select
                                    className="bg-zinc-900 border border-white/10 px-4 py-2 rounded-xl text-xs font-bold text-zinc-400 outline-none"
                                    value={selectedAppearance}
                                    onChange={e => setSelectedAppearance(e.target.value)}
                                >
                                    {appearancePresets.map(({ code, label }) => (
                                        <option key={code} value={code}>{label} Preset</option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-8 col-span-2">
                                    <div className="p-6 bg-zinc-900/50 border border-white/5 rounded-3xl space-y-6">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Skin Properties</label>
                                        <div className="grid grid-cols-3 gap-6">
                                            <select
                                                className="bg-black border border-white/10 px-4 py-3 rounded-xl text-xs font-bold text-white outline-none"
                                                value={skinBase}
                                                onChange={e => setSkinBase(e.target.value)}
                                            >
                                                {ENUMS.skinBases.map(b => <option key={b} value={b}>{b}</option>)}
                                            </select>
                                            <select
                                                className="bg-black border border-white/10 px-4 py-3 rounded-xl text-xs font-bold text-white outline-none"
                                                value={skinUndertone}
                                                onChange={e => setSkinUndertone(e.target.value)}
                                            >
                                                {ENUMS.undertones.map(u => <option key={u} value={u}>{u}</option>)}
                                            </select>
                                            <select
                                                className="bg-black border border-white/10 px-4 py-3 rounded-xl text-xs font-bold text-white outline-none"
                                                value={skinFinish}
                                                onChange={e => setSkinFinish(e.target.value)}
                                            >
                                                {ENUMS.skinFinishes.map(f => <option key={f} value={f}>{f}</option>)}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="p-6 bg-zinc-900/50 border border-white/5 rounded-3xl space-y-6">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Hair Color Properties</label>
                                        <div className="grid grid-cols-2 gap-6">
                                            <select
                                                className="bg-black border border-white/10 px-4 py-3 rounded-xl text-xs font-bold text-white outline-none"
                                                value={hairBaseColor}
                                                onChange={e => setHairBaseColor(e.target.value)}
                                            >
                                                {ENUMS.hairColors.map(c => <option key={c} value={c}>{c}</option>)}
                                            </select>
                                            <Button
                                                variant="ghost"
                                                className={cn(
                                                    "border border-white/10 rounded-xl text-xs font-black uppercase tracking-widest",
                                                    highlightsEnabled ? "bg-blue-500/10 text-blue-400 border-blue-500/20" : "text-zinc-600"
                                                )}
                                                onClick={() => setHighlightsEnabled(!highlightsEnabled)}
                                            >
                                                {highlightsEnabled ? "Highlights ON" : "Highlights OFF"}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Background Selector */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 px-1">
                                <label className="text-sm font-bold uppercase tracking-wider text-white">
                                    Background
                                </label>
                                <div className="w-1 h-1 rounded-full bg-green-500" />
                            </div>
                            <select
                                className="w-full bg-[#030303] border border-white/10 px-6 py-4 rounded-2xl appearance-none focus:border-blue-500/50 outline-none transition-all text-base font-semibold text-white hover:border-white/20"
                                value={selectedBackground}
                                onChange={e => setSelectedBackground(e.target.value)}
                            >
                                {backgrounds.map(({ code, label }) => (
                                    <option key={code} value={code}>{label}</option>
                                ))}
                            </select>
                            {backgrounds.find(b => b.code === selectedBackground) && (
                                <p className="text-xs text-zinc-600 italic px-1">
                                    {backgrounds.find(b => b.code === selectedBackground)?.description}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Output Panel (unchanged) */}
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

                                            {result.prompt?.metadata?.rendered_prompt && (
                                                <div className="space-y-6">
                                                    <div className="flex items-center justify-between px-2">
                                                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500">Rendered Prompt String</span>
                                                    </div>
                                                    <div className="p-8 bg-blue-500/5 border border-blue-500/10 rounded-[2.5rem] text-sm text-zinc-300 leading-relaxed font-medium">
                                                        {result.prompt.metadata.rendered_prompt}
                                                    </div>
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
                                                <p className="text-sm max-w-[280px] leading-relaxed italic text-zinc-800 font-bold">Select outfit and background, then click "Assemble".</p>
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
