"use client";
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { Sparkles, FileJson, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface Selection {
    ET: string | null;
    PH_REGION: string | null;
    VN_REGION: string | null;
    FA: string | null;
    BT: string | null;
    HR: string | null;
    SC: string | null;
    ST: string | null;
    v: string | null;
}

interface PromptFile {
    filename: string;
    canonicalId: string;
    modified: string;
    size: number;
}

interface Registry {
    [dimension: string]: {
        [code: string]: {
            label?: string;
            short_label?: string;
            status?: string;
        };
    };
}

export default function PromptsPage() {
    const [registry, setRegistry] = useState<Registry | null>(null);
    const [allPrompts, setAllPrompts] = useState<PromptFile[]>([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [selection, setSelection] = useState<Selection>({
        ET: null,
        PH_REGION: null,
        VN_REGION: null,
        FA: null,
        BT: null,
        HR: null,
        SC: null,
        ST: null,
        v: null
    });

    // Load data once on mount
    useEffect(() => {
        let mounted = true;

        async function loadData() {
            try {
                const [regRes, promptsRes] = await Promise.all([
                    fetch('/api/registry'),
                    fetch('/api/prompts')
                ]);

                if (!mounted) return;

                const reg = await regRes.json();
                const promptsData = await promptsRes.json();

                setRegistry(reg);
                setAllPrompts(promptsData.prompts || []);

                // Capture error message if present
                if (promptsData.error) {
                    setErrorMessage(promptsData.error);
                }
            } catch (error) {
                console.error('Error loading data:', error);
                if (mounted) {
                    setRegistry({});
                    setAllPrompts([]);
                }
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        }

        loadData();

        return () => {
            mounted = false;
        };
    }, []); // Only run once on mount

    // Memoize unique values extraction
    const uniqueValues = useMemo(() => {
        if (!allPrompts.length) {
            return {
                ET: [],
                PH_REGION: [],
                VN_REGION: [],
                FA: [],
                BT: [],
                HR: [],
                SC: [],
                ST: [],
                v: []
            };
        }

        const sets: Record<string, Set<string>> = {
            ET: new Set(),
            PH_REGION: new Set(),
            VN_REGION: new Set(),
            FA: new Set(),
            BT: new Set(),
            HR: new Set(),
            SC: new Set(),
            ST: new Set(),
            v: new Set()
        };

        allPrompts.forEach(p => {
            const parts = p.canonicalId.split('__');
            parts.forEach(part => {
                const match = part.match(/^([A-Z_]+)-(.+)$/);
                if (match) {
                    const [, dim, code] = match;
                    if (dim in sets) {
                        sets[dim].add(code);
                    }
                } else if (part.startsWith('v')) {
                    sets.v.add(part.substring(1));
                }
            });
        });

        // Filter out deprecated FA codes
        const faValues = Array.from(sets.FA).filter(fa => {
            if (!registry || !registry.FA || !registry.FA[fa]) return true;
            return registry.FA[fa].status !== 'deprecated';
        });

        return {
            ET: Array.from(sets.ET).sort(),
            PH_REGION: Array.from(sets.PH_REGION).sort(),
            VN_REGION: Array.from(sets.VN_REGION).sort(),
            FA: faValues.sort(),
            BT: Array.from(sets.BT).sort(),
            HR: Array.from(sets.HR).sort(),
            SC: Array.from(sets.SC).sort(),
            ST: Array.from(sets.ST).sort(),
            v: Array.from(sets.v).sort()
        };
    }, [allPrompts, registry]);

    // Memoize filtered prompts
    const filteredPrompts = useMemo(() => {
        if (!allPrompts.length) return [];

        return allPrompts.filter(prompt => {
            if (selection.ET && !prompt.canonicalId.includes(`ET-${selection.ET}`)) return false;
            if (selection.PH_REGION && !prompt.canonicalId.includes(`PH_REGION-${selection.PH_REGION}`)) return false;
            if (selection.VN_REGION && !prompt.canonicalId.includes(`VN_REGION-${selection.VN_REGION}`)) return false;
            if (selection.FA && !prompt.canonicalId.includes(`FA-${selection.FA}`)) return false;
            if (selection.BT && !prompt.canonicalId.includes(`BT-${selection.BT}`)) return false;
            if (selection.HR && !prompt.canonicalId.includes(`HR-${selection.HR}`)) return false;
            if (selection.SC && !prompt.canonicalId.includes(`SC-${selection.SC}`)) return false;
            if (selection.ST && !prompt.canonicalId.includes(`ST-${selection.ST}`)) return false;
            if (selection.v && !prompt.canonicalId.includes(`v${selection.v}`)) return false;
            return true;
        });
    }, [allPrompts, selection]);

    // Memoize label getter
    const getLabel = useCallback((dim: string, code: string): string => {
        if (!registry || !registry[dim] || !registry[dim][code]) return code;
        // Prefer short_label for cleaner display (avoids ethnicity duplication in deprecated codes)
        return registry[dim][code].short_label || registry[dim][code].label || code;
    }, [registry]);

    // Memoize title builder
    const buildPromptTitle = useCallback((canonicalId: string): string => {
        const parts = canonicalId.split('__');
        const parsed: Record<string, string> = {};

        parts.forEach(part => {
            const match = part.match(/^([A-Z_]+)-(.+)$/);
            if (match) {
                const [, dimension, code] = match;
                parsed[dimension] = code;
            } else if (part.startsWith('v')) {
                parsed.v = part.substring(1);
            }
        });

        // Resolve Ethnicity/Region first for a cleaner title
        let etDisplay = getLabel('ET', parsed.ET || '');
        if (parsed.PH_REGION) {
            etDisplay += ` (${getLabel('PH_REGION', parsed.PH_REGION)})`;
        } else if (parsed.VN_REGION) {
            etDisplay += ` (${getLabel('VN_REGION', parsed.VN_REGION)})`;
        }

        const labels = [
            getLabel('FA', parsed.FA || ''),
            getLabel('BT', parsed.BT || ''),
            etDisplay,
            getLabel('HR', parsed.HR || ''),
            getLabel('SC', parsed.SC || ''),
            getLabel('ST', parsed.ST || ''),
            parsed.v ? `v${parsed.v}` : ''
        ].filter(Boolean);

        return labels.join(' · ');
    }, [getLabel]);

    // Stable selection handlers
    const handleSelectionChange = useCallback((key: keyof Selection, value: string | null) => {
        setSelection(prev => ({ ...prev, [key]: value }));
    }, []);

    if (loading) {
        return (
            <div className="space-y-24 pb-40">
                <div className="flex items-center justify-center h-96">
                    <div className="text-zinc-600 text-lg">Loading prompt library...</div>
                </div>
            </div>
        );
    }

    if (!registry) {
        return (
            <div className="space-y-24 pb-40">
                <Card className="bg-[#050505] border-white/5 p-20">
                    <div className="text-center space-y-6">
                        <FileJson size={64} className="mx-auto text-zinc-700" />
                        <div className="space-y-2">
                            <h3 className="text-2xl font-black text-white">Failed to Load</h3>
                            <p className="text-zinc-500">Could not load registry data.</p>
                        </div>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-16 pb-40">
            <div className="space-y-10">
                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/[0.03] border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl">
                    <Sparkles size={14} className="text-green-500 fill-green-500/20" />
                    Saved Prompt Library
                </div>
                <div className="space-y-6">
                    <h1 className="text-9xl font-black tracking-[-0.05em] text-white leading-[0.85]">
                        Saved Prompts<span className="text-green-500">.</span>
                    </h1>
                    <p className="text-zinc-500 text-2xl font-medium max-w-2xl leading-relaxed">
                        Browse and filter previously generated editorial prompts. <br />
                        <span className="text-zinc-600">Finder-style filtering by identity, background, and style.</span>
                    </p>
                </div>
            </div>

            {/* Finder Columns */}
            <div className="grid grid-cols-8 gap-3 h-[500px]">
                {/* Column 1: Ethnicity */}
                <FilterColumn
                    title="Ethnicity"
                    dimension="ET"
                    values={uniqueValues.ET}
                    selectedValue={selection.ET}
                    onSelect={(val) => {
                        handleSelectionChange('ET', val);
                        // Reset region when ethnicity changes
                        handleSelectionChange('PH_REGION', null);
                        handleSelectionChange('VN_REGION', null);
                    }}
                    getLabel={getLabel}
                />

                {/* Column 2: Region (Dynamic) */}
                <FilterColumn
                    title="Region"
                    dimension={selection.ET === 'VN' ? 'VN_REGION' : 'PH_REGION'}
                    values={selection.ET === 'VN' ? uniqueValues.VN_REGION : uniqueValues.PH_REGION}
                    selectedValue={selection.ET === 'VN' ? selection.VN_REGION : selection.PH_REGION}
                    onSelect={(val) => {
                        if (selection.ET === 'VN') handleSelectionChange('VN_REGION', val);
                        else handleSelectionChange('PH_REGION', val);
                    }}
                    getLabel={getLabel}
                    disabled={selection.ET !== 'PH' && selection.ET !== 'VN'}
                />

                {/* Column 3: Face */}
                <FilterColumn
                    title="Face Archetype"
                    dimension="FA"
                    values={uniqueValues.FA}
                    selectedValue={selection.FA}
                    onSelect={(val) => handleSelectionChange('FA', val)}
                    getLabel={getLabel}
                />

                {/* Column 4: Body */}
                <FilterColumn
                    title="Body Type"
                    dimension="BT"
                    values={uniqueValues.BT}
                    selectedValue={selection.BT}
                    onSelect={(val) => handleSelectionChange('BT', val)}
                    getLabel={getLabel}
                />

                {/* Column 5: Hair */}
                <FilterColumn
                    title="Hair Style"
                    dimension="HR"
                    values={uniqueValues.HR}
                    selectedValue={selection.HR}
                    onSelect={(val) => handleSelectionChange('HR', val)}
                    getLabel={getLabel}
                />

                {/* Column 6: Scene */}
                <FilterColumn
                    title="Background"
                    dimension="SC"
                    values={uniqueValues.SC}
                    selectedValue={selection.SC}
                    onSelect={(val) => handleSelectionChange('SC', val)}
                    getLabel={getLabel}
                />

                {/* Column 7: Outfit */}
                <FilterColumn
                    title="Outfit"
                    dimension="ST"
                    values={uniqueValues.ST}
                    selectedValue={selection.ST}
                    onSelect={(val) => handleSelectionChange('ST', val)}
                    getLabel={getLabel}
                />

                {/* Column 8: Version */}
                <FilterColumn
                    title="Version"
                    dimension="v"
                    values={uniqueValues.v}
                    selectedValue={selection.v}
                    onSelect={(val) => handleSelectionChange('v', val)}
                    getLabel={(_, code) => `v${code}`}
                    showChevron={false}
                />
            </div>

            {/* Filtered Results */}
            <div className="space-y-8">
                <div className="flex items-center gap-4 px-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-600">
                        Matching Prompts
                    </h2>
                    <div className="text-xs text-zinc-700 font-mono">({filteredPrompts.length})</div>
                </div>

                {filteredPrompts.length === 0 ? (
                    <Card className="bg-[#050505] border-white/5 p-12">
                        <div className="text-center space-y-4">
                            <FileJson size={48} className="mx-auto text-zinc-700" />
                            <div className="space-y-2">
                                <p className="text-zinc-500">
                                    {errorMessage
                                        ? errorMessage
                                        : allPrompts.length === 0
                                            ? 'No saved prompts found. Generate prompts locally and they will appear here.'
                                            : 'No prompts match your filter criteria.'}
                                </p>
                                {errorMessage && (
                                    <p className="text-xs text-zinc-600 font-mono">
                                        Run: <code className="bg-zinc-900 px-2 py-1 rounded">npm run sync-prompts</code>
                                    </p>
                                )}
                            </div>
                        </div>
                    </Card>
                ) : (
                    <div className="space-y-3">
                        {filteredPrompts.map(prompt => (
                            <PromptCard
                                key={prompt.filename}
                                prompt={prompt}
                                buildTitle={buildPromptTitle}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

// Memoized filter column component
interface FilterColumnProps {
    title: string;
    dimension: string;
    values: string[];
    selectedValue: string | null;
    onSelect: (value: string | null) => void;
    getLabel: (dim: string, code: string) => string;
    showChevron?: boolean;
    disabled?: boolean;
}

const FilterColumn = React.memo(function FilterColumn({
    title,
    dimension,
    values,
    selectedValue,
    onSelect,
    getLabel,
    showChevron = true,
    disabled = false
}: FilterColumnProps) {
    return (
        <Card className={cn(
            "bg-[#050505] border-white/5 overflow-hidden flex flex-col transition-opacity duration-300",
            disabled ? "opacity-30 pointer-events-none grayscale" : "opacity-100"
        )}>
            <div className="border-b border-white/5 px-4 py-3 bg-zinc-900/50">
                <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-wide">{title}</p>
            </div>
            <div className="flex-1 overflow-y-auto">
                <button
                    onClick={() => onSelect(null)}
                    disabled={disabled}
                    className={cn(
                        "w-full px-4 py-2.5 text-left border-b border-white/5 transition-all text-xs",
                        selectedValue === null
                            ? "bg-green-500/20 text-white font-bold"
                            : "text-zinc-400 hover:bg-white/5 hover:text-white"
                    )}
                >
                    Any
                </button>
                {values.map(value => (
                    <button
                        key={value}
                        onClick={() => onSelect(value)}
                        disabled={disabled}
                        className={cn(
                            "w-full px-4 py-2.5 text-left border-b border-white/5 transition-all text-xs",
                            selectedValue === value
                                ? "bg-green-500/20 text-white font-bold"
                                : "text-zinc-400 hover:bg-white/5 hover:text-white"
                        )}
                    >
                        <div className="flex items-center justify-between">
                            <span>{getLabel(dimension, value)}</span>
                            {showChevron && selectedValue === value && <ChevronRight size={14} />}
                        </div>
                    </button>
                ))}
            </div>
        </Card>
    );
});

// Memoized prompt card component
interface PromptCardProps {
    prompt: PromptFile;
    buildTitle: (canonicalId: string) => string;
}

const PromptCard = React.memo(function PromptCard({ prompt, buildTitle }: PromptCardProps) {
    return (
        <Link href={`/prompts/${prompt.canonicalId}`}>
            <Card className="bg-[#050505] border-white/5 hover:border-white/20 transition-all duration-500 cursor-pointer group">
                <CardContent className="p-6">
                    <div className="space-y-2">
                        <h3 className="text-lg font-bold text-white group-hover:text-green-500 transition-colors">
                            {buildTitle(prompt.canonicalId)}
                        </h3>
                        <p className="text-xs font-mono text-zinc-600">
                            {prompt.canonicalId}
                        </p>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
});
