"use client";
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Package, ArrowLeft, ExternalLink, FileJson, User, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface PackData {
    FA?: string;
    BT?: string;
    ET?: string;
    HR?: string;
    SC?: string;
    ST?: string;
}

interface PromptFile {
    filename: string;
    canonicalId: string;
}

export default function SubjectPackDetailPage() {
    const params = useParams();
    const router = useRouter();
    const packCode = params.code as string;

    const [packData, setPackData] = useState<PackData | null>(null);
    const [registry, setRegistry] = useState<any>(null);
    const [relatedPrompts, setRelatedPrompts] = useState<PromptFile[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            try {
                // Load pack data
                const packRes = await fetch(`/api/module?dim=SUB&code=${packCode}`);
                const pack = await packRes.json();
                setPackData(pack);

                // Load registry for labels
                const regRes = await fetch('/api/registry');
                const reg = await regRes.json();
                setRegistry(reg);

                // Load all prompts and filter for matches
                const promptsRes = await fetch('/api/prompts');
                const promptsData = await promptsRes.json();

                if (promptsData.prompts && pack) {
                    const matching = promptsData.prompts.filter((p: PromptFile) => {
                        return (
                            p.canonicalId.includes(`FA-${pack.FA}`) &&
                            p.canonicalId.includes(`BT-${pack.BT}`) &&
                            p.canonicalId.includes(`ET-${pack.ET}`) &&
                            p.canonicalId.includes(`HR-${pack.HR}`)
                        );
                    });
                    setRelatedPrompts(matching);
                }
            } catch (error) {
                console.error('Error loading pack:', error);
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, [packCode]);

    if (loading) {
        return (
            <div className="space-y-24 pb-40">
                <div className="flex items-center justify-center h-96">
                    <div className="text-zinc-600 text-lg">Loading pack...</div>
                </div>
            </div>
        );
    }

    if (!packData || !registry) {
        return (
            <div className="space-y-24 pb-40">
                <Card className="bg-[#050505] border-white/5 p-20">
                    <div className="text-center space-y-6">
                        <Package size={64} className="mx-auto text-zinc-700" />
                        <div className="space-y-2">
                            <h3 className="text-2xl font-black text-white">Pack Not Found</h3>
                            <p className="text-zinc-500">The requested pack could not be loaded.</p>
                        </div>
                        <Button onClick={() => router.push('/packs')} className="bg-white text-black">
                            <ArrowLeft size={16} />
                            Back to Packs
                        </Button>
                    </div>
                </Card>
            </div>
        );
    }

    const getLabel = (dim: string, code: string) => {
        return registry[dim]?.[code]?.label || code;
    };

    return (
        <div className="space-y-16 pb-40">
            <div className="space-y-8">
                <Button
                    onClick={() => router.push('/packs')}
                    variant="ghost"
                    className="text-zinc-500 hover:text-white -ml-4"
                >
                    <ArrowLeft size={16} />
                    Back to Packs
                </Button>

                <div className="space-y-6">
                    <div className="flex items-start justify-between gap-8">
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center">
                                    <User size={28} className="text-blue-500" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-mono text-zinc-700 font-bold uppercase tracking-widest">
                                        Subject Pack
                                    </p>
                                    <h1 className="text-5xl font-black text-white">{packCode}</h1>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-sm font-black uppercase tracking-wider text-zinc-600">Included Modules</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <Card className="bg-zinc-900 border-white/5">
                                        <CardContent className="p-6 space-y-2">
                                            <p className="text-xs font-mono text-zinc-600 uppercase">Face</p>
                                            <p className="text-lg font-bold text-white">{getLabel('FA', packData.FA!)}</p>
                                            <p className="text-xs font-mono text-zinc-500">{packData.FA}</p>
                                        </CardContent>
                                    </Card>
                                    <Card className="bg-zinc-900 border-white/5">
                                        <CardContent className="p-6 space-y-2">
                                            <p className="text-xs font-mono text-zinc-600 uppercase">Body</p>
                                            <p className="text-lg font-bold text-white">{getLabel('BT', packData.BT!)}</p>
                                            <p className="text-xs font-mono text-zinc-500">{packData.BT}</p>
                                        </CardContent>
                                    </Card>
                                    <Card className="bg-zinc-900 border-white/5">
                                        <CardContent className="p-6 space-y-2">
                                            <p className="text-xs font-mono text-zinc-600 uppercase">Ethnicity</p>
                                            <p className="text-lg font-bold text-white">{getLabel('ET', packData.ET!)}</p>
                                            <p className="text-xs font-mono text-zinc-500">{packData.ET}</p>
                                        </CardContent>
                                    </Card>
                                    <Card className="bg-zinc-900 border-white/5">
                                        <CardContent className="p-6 space-y-2">
                                            <p className="text-xs font-mono text-zinc-600 uppercase">Hair</p>
                                            <p className="text-lg font-bold text-white">{getLabel('HR', packData.HR!)}</p>
                                            <p className="text-xs font-mono text-zinc-500">{packData.HR}</p>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </div>

                        <Link href={`/builder?FA=${packData.FA}&BT=${packData.BT}&ET=${packData.ET}&HR=${packData.HR}`}>
                            <Button className="h-16 px-10 rounded-2xl bg-white text-black font-black text-lg gap-3 shadow-2xl">
                                <ExternalLink size={20} />
                                Open in Builder
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Related Prompts */}
            <div className="space-y-8">
                <div className="flex items-center gap-4 px-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-600">
                        Saved Prompts from this Pack
                    </h2>
                    <div className="text-xs text-zinc-700 font-mono">({relatedPrompts.length})</div>
                </div>

                {relatedPrompts.length === 0 ? (
                    <Card className="bg-[#050505] border-white/5 p-12">
                        <div className="text-center space-y-4">
                            <FileJson size={48} className="mx-auto text-zinc-700" />
                            <div className="space-y-2">
                                <p className="text-zinc-500">No saved prompts found for this pack combination.</p>
                                <p className="text-sm text-zinc-700">
                                    Build prompts locally and commit them to see them here.
                                </p>
                            </div>
                        </div>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {relatedPrompts.map(prompt => (
                            <Link key={prompt.filename} href={`/prompts/${prompt.canonicalId}`}>
                                <Card className="bg-[#050505] border-white/5 hover:border-white/20 transition-all duration-500 cursor-pointer group">
                                    <CardContent className="p-6 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <FileJson size={20} className="text-green-500" />
                                            <p className="font-mono text-sm text-zinc-400 group-hover:text-white transition-colors">
                                                {prompt.canonicalId}
                                            </p>
                                        </div>
                                        <ExternalLink size={16} className="text-zinc-600 group-hover:text-white transition-colors" />
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
