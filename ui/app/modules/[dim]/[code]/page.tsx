"use client";
import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Editor from '@monaco-editor/react';
import {
    Save,
    AlertCircle,
    CheckCircle2,
    FileJson,
    Layout,
    ChevronLeft,
    ArrowRight,
    ExternalLink,
    Lock,
    Eye,
    Settings2,
    Code2,
    Terminal,
    Box
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const FOLDER_MAP: Record<string, string> = {
    FA: "face", BT: "body", ET: "ethnicity", HR: "hair", SC: "scene", ST: "outfit", NB: "negative"
};

export default function ModuleEditor() {
    const { dim, code } = useParams();
    const [content, setContent] = useState<any>(null);
    const [rawText, setRawText] = useState("");
    const [registryInfo, setRegistryInfo] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [activeTab, setActiveTab] = useState("guided");

    const folder = FOLDER_MAP[dim as string];
    const filePath = `components/${folder}/${code}.json`;

    useEffect(() => {
        async function loadData() {
            const [modRes, regRes] = await Promise.all([
                fetch(`/api/module?path=${filePath}`),
                fetch('/api/registry')
            ]);
            const modData = await modRes.json();
            const regData = await regRes.json();

            if (!modData.error) {
                setContent(modData);
                setRawText(JSON.stringify(modData, null, 2));
            }
            setRegistryInfo(regData[dim as string]?.[code as string] || {});
            setLoading(false);
        }
        loadData();
    }, [dim, code, filePath]);

    const handleSave = async (dataToSave: any) => {
        setSaving(true);
        setMessage(null);
        try {
            const res = await fetch('/api/module', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ filePath, content: dataToSave })
            });
            const result = await res.json();
            if (!result.success) {
                setMessage({ type: 'error', text: result.details || result.error });
            } else {
                setMessage({ type: 'success', text: "Module verified and persisted successfully." });
                setContent(dataToSave);
                setRawText(JSON.stringify(dataToSave, null, 2));
            }
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message });
        } finally {
            setSaving(false);
        }
    };

    const syncFromJson = (val: string | undefined) => {
        setRawText(val || "");
        try {
            const parsed = JSON.parse(val || "{}");
            setContent(parsed);
        } catch { }
    };

    if (loading) return (
        <div className="h-[60vh] flex flex-col items-center justify-center gap-6">
            <div className="w-12 h-12 border-2 border-white/5 border-t-white rounded-full animate-spin" />
            <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest">Hydrating Source</p>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto pb-32 space-y-16">
            {/* Header Deck */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <Link href={`/modules/${dim}`} className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 hover:text-white transition-colors">
                            {dim as string} Modules
                        </Link>
                        <div className="w-1 h-1 rounded-full bg-zinc-800" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 font-mono">{code}.json</span>
                    </div>
                    <h1 className="text-6xl font-black tracking-tighter text-white">
                        {registryInfo.label || code}
                    </h1>
                    {registryInfo.description && (
                        <p className="text-zinc-500 text-lg font-medium italic max-w-2xl">"{registryInfo.description}"</p>
                    )}
                </div>

                <div className="flex items-center gap-4">
                    <Button variant="outline" size="lg" className="h-14 rounded-2xl border-white/5 px-6" asChild>
                        <a href={`/api/module?path=${filePath}`} target="_blank">
                            <Eye size={18} className="mr-2" />
                            Raw View
                        </a>
                    </Button>
                    <Button
                        size="lg"
                        className="h-14 px-10 rounded-2xl bg-white text-black font-black text-base tracking-tight"
                        onClick={() => activeTab === 'json' ? handleSave(JSON.parse(rawText)) : handleSave(content)}
                        disabled={saving}
                    >
                        <Save size={18} className="mr-3" />
                        {saving ? "Deploying..." : "Update Module"}
                    </Button>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {message && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className={cn(
                            "p-6 rounded-3xl border flex gap-4 items-start relative overflow-hidden",
                            message.type === 'success'
                                ? "bg-green-500/5 border-green-500/20 text-green-400"
                                : "bg-red-500/5 border-red-500/20 text-red-500"
                        )}
                    >
                        <div className={cn("absolute inset-0 opacity-5", message.type === 'success' ? "bg-green-500" : "bg-red-500")} />
                        {message.type === 'success' ? <CheckCircle2 size={20} className="shrink-0 mt-0.5" /> : <AlertCircle size={20} className="shrink-0 mt-0.5" />}
                        <div className="space-y-1 relative z-10 font-bold">
                            <p className="text-sm uppercase tracking-wider">{message.type === 'success' ? 'Validation Successful' : 'Lint Error Detected'}</p>
                            <pre className="text-xs font-mono opacity-80 whitespace-pre-wrap leading-relaxed">{message.text}</pre>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-8">
                <TabsList className="bg-transparent border-b border-white/5 rounded-none h-auto p-0 gap-8">
                    <TabsTrigger value="guided" className="data-[state=active]:bg-transparent data-[state=active]:text-white rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 pb-4 text-xs font-black uppercase tracking-widest gap-3 px-0">
                        <Settings2 size={16} />
                        Guided Editor
                    </TabsTrigger>
                    <TabsTrigger value="json" className="data-[state=active]:bg-transparent data-[state=active]:text-white rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 pb-4 text-xs font-black uppercase tracking-widest gap-3 px-0">
                        <Code2 size={16} />
                        JSON Architect
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="guided" className="animate-in fade-in slide-in-from-top-4 duration-500">
                    <Card className="rounded-[3rem] border-white/5 bg-[#070707]">
                        <CardContent className="p-16 space-y-16">
                            {/* Specialized Form Sections */}
                            {dim === 'FA' && (
                                <div className="max-w-2xl space-y-12">
                                    <div className="space-y-4">
                                        <label className="flex items-center gap-2 text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em]">
                                            <Lock size={12} className="text-blue-500" />
                                            Face Identity Anchor
                                        </label>
                                        <input
                                            className="w-full bg-black border border-white/5 rounded-2xl p-5 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-mono text-zinc-100"
                                            value={content.subject?.face_anchor || ""}
                                            onChange={e => setContent({ ...content, subject: { ...content.subject, face_anchor: e.target.value } })}
                                        />
                                        <p className="text-[10px] text-zinc-700 italic">Unique cryptographic-style anchor for face consistency.</p>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="flex items-center gap-2 text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em]">
                                            <Terminal size={12} className="text-zinc-600" />
                                            Stability Constraints
                                        </label>
                                        <textarea
                                            className="w-full h-48 bg-black border border-white/5 rounded-3xl p-6 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-mono text-sm leading-8 text-zinc-300 shadow-inner"
                                            value={content.subject?.do_not_change?.join('\n') || ""}
                                            onChange={e => {
                                                const lines = e.target.value.split('\n');
                                                setContent({ ...content, subject: { ...content.subject, do_not_change: lines } });
                                            }}
                                            placeholder="Enter one item per line"
                                        />
                                        <p className="text-[10px] text-zinc-700 italic">Features that must remain immutable during the generation process.</p>
                                    </div>
                                </div>
                            )}

                            {dim === 'NB' && (
                                <div className="space-y-4 max-w-3xl">
                                    <label className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em]">Negative Prompt Matrix</label>
                                    <textarea
                                        className="w-full h-72 bg-black border border-white/5 rounded-[2rem] p-8 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-base leading-relaxed text-zinc-300 font-medium"
                                        value={content.negative_prompt || ""}
                                        onChange={e => setContent({ ...content, negative_prompt: e.target.value })}
                                    />
                                </div>
                            )}

                            {/* General Section */}
                            <div className="p-10 rounded-[2rem] border border-dashed border-white/[0.03] bg-white/[0.01] flex flex-col items-center justify-center text-center gap-4">
                                <Box size={24} className="text-zinc-800" />
                                <div className="space-y-1">
                                    <p className="text-sm font-bold text-zinc-600 tracking-tight">Advanced Structural Control</p>
                                    <p className="text-xs text-zinc-700 max-w-sm leading-relaxed font-medium">For modifying additional schema keys or deep nested values, please utilize the JSON Architect mode.</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="json" className="animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="rounded-[2.5rem] border border-white/5 overflow-hidden bg-black shadow-2xl shadow-blue-500/5">
                        <Editor
                            height="65vh"
                            defaultLanguage="json"
                            theme="vs-dark"
                            value={rawText}
                            onChange={syncFromJson}
                            options={{
                                minimap: { enabled: false },
                                fontSize: 15,
                                padding: { top: 40, bottom: 40 },
                                lineNumbers: 'on',
                                scrollBeyondLastLine: false,
                                automaticLayout: true,
                                fontFamily: 'JetBrains Mono, Menlo, monospace',
                                lineHeight: 28,
                                cursorSmoothCaretAnimation: "on",
                                smoothScrolling: true,
                                renderLineHighlight: "all"
                            }}
                        />
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
