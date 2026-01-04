"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Sparkles, ExternalLink, FileJson, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface Selection {
    ethnicity: string | null;
    archetype: string | null;
    body: string | null;
    hair: string | null;
}

export default function BrowsePage() {
    const [registry, setRegistry] = useState<any>(null);
    const [selection, setSelection] = useState<Selection>({
        ethnicity: null,
        archetype: null,
        body: null,
        hair: null
    });
    const [relatedPrompts, setRelatedPrompts] = useState<any[]>([]);

    useEffect(() => {
        async function loadRegistry() {
            const res = await fetch('/api/registry');
            const data = await res.json();
            setRegistry(data);
        }
        loadRegistry();
    }, []);

    useEffect(() => {
        // Load related prompts when selection changes
        async function loadRelatedPrompts() {
            if (!selection.ethnicity || !selection.archetype) return;

            try {
                const res = await fetch('/api/prompts');
                const data = await res.json();

                // Find face code that matches ethnicity and archetype
                const faceCode = Object.keys(registry.FA || {}).find(code => {
                    const meta = registry.FA[code];
                    return meta.ethnicity === selection.ethnicity &&
                        meta.archetype === selection.archetype;
                });

                if (!faceCode) return;

                const matching = (data.prompts || []).filter((p: any) => {
                    let matches = p.canonicalId.includes(`FA-${faceCode}`);
                    if (selection.body) matches = matches && p.canonicalId.includes(`BT-${selection.body}`);
                    if (selection.hair) matches = matches && p.canonicalId.includes(`HR-${selection.hair}`);
                    return matches;
                });

                setRelatedPrompts(matching);
            } catch (error) {
                console.error('Error loading prompts:', error);
            }
        }

        if (registry) {
            loadRelatedPrompts();
        }
    }, [selection, registry]);

    if (!registry) {
        return (
            <div className="space-y-24 pb-40">
                <div className="flex items-center justify-center h-96">
                    <div className="text-zinc-600 text-lg">Loading...</div>
                </div>
            </div>
        );
    }

    // Get unique ethnicities from FA codes
    const ethnicities = Array.from(new Set(
        Object.values(registry.FA || {}).map((fa: any) => fa.ethnicity)
    )).filter(Boolean);

    // Get archetypes filtered by selected ethnicity
    const archetypes = selection.ethnicity
        ? Array.from(new Set(
            Object.values(registry.FA || {})
                .filter((fa: any) => fa.ethnicity === selection.ethnicity)
                .map((fa: any) => fa.archetype)
        )).filter(Boolean)
        : [];

    // Get all body types
    const bodies = Object.keys(registry.BT || {});

    // Get all hair styles
    const hairs = Object.keys(registry.HR || {});

    // Find selected face code
    const selectedFaceCode = selection.ethnicity && selection.archetype
        ? Object.keys(registry.FA || {}).find(code => {
            const meta = registry.FA[code];
            return meta.ethnicity === selection.ethnicity &&
                meta.archetype === selection.archetype &&
                meta.status === 'winner';
        })
        : null;

    const canOpenBuilder = selectedFaceCode && selection.body && selection.hair;

    return (
        <div className="space-y-16 pb-40">
            <div className="space-y-10">
                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/[0.03] border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl">
                    <Sparkles size={14} className="text-cyan-500 fill-cyan-500/20" />
                    Finder-Style Navigation
                </div>
                <div className="space-y-6">
                    <h1 className="text-9xl font-black tracking-[-0.05em] text-white leading-[0.85]">
                        Browse<span className="text-cyan-500">.</span>
                    </h1>
                    <p className="text-zinc-500 text-2xl font-medium max-w-2xl leading-relaxed">
                        Navigate your module library with macOS Finder-style column view. <br />
                        <span className="text-zinc-800">Select ethnicity → archetype → body → hair to build your combination.</span>
                    </p>
                </div>
            </div>

            {/* Finder Columns */}
            <div className="grid grid-cols-4 gap-4 h-[600px]">
                {/* Column 1: Ethnicity */}
                <Card className="bg-[#050505] border-white/5 overflow-hidden flex flex-col">
                    <div className="border-b border-white/5 px-6 py-4 bg-zinc-900/50">
                        <p className="text-xs font-mono text-zinc-500 uppercase tracking-wider">Ethnicity</p>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {ethnicities.map((eth: any) => (
                            <button
                                key={eth}
                                onClick={() => setSelection({ ethnicity: eth, archetype: null, body: null, hair: null })}
                                className={cn(
                                    "w-full px-6 py-4 text-left border-b border-white/5 transition-all",
                                    selection.ethnicity === eth
                                        ? "bg-cyan-500/20 text-white font-bold"
                                        : "text-zinc-400 hover:bg-white/5 hover:text-white"
                                )}
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">{eth}</span>
                                    {selection.ethnicity === eth && <ChevronRight size={16} />}
                                </div>
                            </button>
                        ))}
                    </div>
                </Card>

                {/* Column 2: Archetype */}
                <Card className="bg-[#050505] border-white/5 overflow-hidden flex flex-col">
                    <div className="border-b border-white/5 px-6 py-4 bg-zinc-900/50">
                        <p className="text-xs font-mono text-zinc-500 uppercase tracking-wider">Archetype</p>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {archetypes.length === 0 ? (
                            <div className="px-6 py-12 text-center text-zinc-600 text-sm">
                                Select ethnicity
                            </div>
                        ) : (
                            archetypes.map((arch: any) => (
                                <button
                                    key={arch}
                                    onClick={() => setSelection({ ...selection, archetype: arch, body: null, hair: null })}
                                    className={cn(
                                        "w-full px-6 py-4 text-left border-b border-white/5 transition-all",
                                        selection.archetype === arch
                                            ? "bg-cyan-500/20 text-white font-bold"
                                            : "text-zinc-400 hover:bg-white/5 hover:text-white"
                                    )}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm">{arch}</span>
                                        {selection.archetype === arch && <ChevronRight size={16} />}
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                </Card>

                {/* Column 3: Body */}
                <Card className="bg-[#050505] border-white/5 overflow-hidden flex flex-col">
                    <div className="border-b border-white/5 px-6 py-4 bg-zinc-900/50">
                        <p className="text-xs font-mono text-zinc-500 uppercase tracking-wider">Body</p>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {!selection.archetype ? (
                            <div className="px-6 py-12 text-center text-zinc-600 text-sm">
                                Select archetype
                            </div>
                        ) : (
                            bodies.map((body: string) => (
                                <button
                                    key={body}
                                    onClick={() => setSelection({ ...selection, body, hair: null })}
                                    className={cn(
                                        "w-full px-6 py-4 text-left border-b border-white/5 transition-all",
                                        selection.body === body
                                            ? "bg-cyan-500/20 text-white font-bold"
                                            : "text-zinc-400 hover:bg-white/5 hover:text-white"
                                    )}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <p className="text-sm">{registry.BT[body].label}</p>
                                            <p className="text-xs text-zinc-600 font-mono">{body}</p>
                                        </div>
                                        {selection.body === body && <ChevronRight size={16} />}
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                </Card>

                {/* Column 4: Hair */}
                <Card className="bg-[#050505] border-white/5 overflow-hidden flex flex-col">
                    <div className="border-b border-white/5 px-6 py-4 bg-zinc-900/50">
                        <p className="text-xs font-mono text-zinc-500 uppercase tracking-wider">Hair</p>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {!selection.body ? (
                            <div className="px-6 py-12 text-center text-zinc-600 text-sm">
                                Select body
                            </div>
                        ) : (
                            hairs.map((hair: string) => (
                                <button
                                    key={hair}
                                    onClick={() => setSelection({ ...selection, hair })}
                                    className={cn(
                                        "w-full px-6 py-4 text-left border-b border-white/5 transition-all",
                                        selection.hair === hair
                                            ? "bg-cyan-500/20 text-white font-bold"
                                            : "text-zinc-400 hover:bg-white/5 hover:text-white"
                                    )}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <p className="text-sm">{registry.HR[hair].label}</p>
                                            <p className="text-xs text-zinc-600 font-mono">{hair}</p>
                                        </div>
                                        {selection.hair === hair && <ChevronRight size={16} />}
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                </Card>
            </div>

            {/* Preview & Actions */}
            {canOpenBuilder && (
                <Card className="bg-[#050505] border-white/5">
                    <CardContent className="p-10 space-y-8">
                        <div className="space-y-4">
                            <h3 className="text-sm font-black uppercase tracking-wider text-zinc-600">Current Selection</h3>
                            <div className="flex items-center gap-4 flex-wrap">
                                <span className="text-sm font-mono text-zinc-400 bg-zinc-900 px-4 py-2 rounded-lg border border-white/5">
                                    FA: <span className="text-white font-bold">{selectedFaceCode}</span>
                                </span>
                                <span className="text-sm font-mono text-zinc-400 bg-zinc-900 px-4 py-2 rounded-lg border border-white/5">
                                    BT: <span className="text-white font-bold">{selection.body}</span>
                                </span>
                                <span className="text-sm font-mono text-zinc-400 bg-zinc-900 px-4 py-2 rounded-lg border border-white/5">
                                    HR: <span className="text-white font-bold">{selection.hair}</span>
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <Link href={`/builder?FA=${selectedFaceCode}&BT=${selection.body}&HR=${selection.hair}`}>
                                <Button className="h-14 px-8 rounded-2xl bg-white text-black font-black gap-3 shadow-2xl">
                                    <ExternalLink size={20} />
                                    Open in Builder
                                </Button>
                            </Link>

                            {relatedPrompts.length > 0 && (
                                <div className="text-sm text-zinc-500">
                                    {relatedPrompts.length} saved prompt{relatedPrompts.length !== 1 ? 's' : ''} found
                                </div>
                            )}
                        </div>

                        {relatedPrompts.length > 0 && (
                            <div className="space-y-4">
                                <h4 className="text-xs font-black uppercase tracking-wider text-zinc-600">Saved Prompts</h4>
                                <div className="space-y-2">
                                    {relatedPrompts.slice(0, 5).map((prompt: any) => (
                                        <Link key={prompt.filename} href={`/prompts/${prompt.canonicalId}`}>
                                            <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-zinc-900 border border-white/5 hover:border-white/20 transition-all cursor-pointer group">
                                                <FileJson size={16} className="text-green-500" />
                                                <p className="font-mono text-xs text-zinc-400 group-hover:text-white transition-colors flex-1">
                                                    {prompt.canonicalId}
                                                </p>
                                                <ExternalLink size={14} className="text-zinc-600 group-hover:text-white transition-colors" />
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
