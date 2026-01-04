"use client";
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FileJson, Copy, Check, ArrowLeft, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import MonacoEditor from '@monaco-editor/react';

export default function PromptDetailPage() {
    const params = useParams();
    const router = useRouter();
    const canonicalId = params.id as string;
    const filename = `${canonicalId}.json`;

    const [promptData, setPromptData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [copiedJSON, setCopiedJSON] = useState(false);
    const [copiedText, setCopiedText] = useState(false);
    const [copiedID, setCopiedID] = useState(false);

    useEffect(() => {
        async function loadPrompt() {
            try {
                const res = await fetch(`/api/prompts/file?name=${filename}`);
                if (res.ok) {
                    const data = await res.json();
                    setPromptData(data);
                }
            } catch (error) {
                console.error('Error loading prompt:', error);
            } finally {
                setLoading(false);
            }
        }

        loadPrompt();
    }, [filename]);

    function copyJSON() {
        if (promptData) {
            navigator.clipboard.writeText(JSON.stringify(promptData, null, 2));
            setCopiedJSON(true);
            setTimeout(() => setCopiedJSON(false), 2000);
        }
    }

    function flattenPrompt(data: any): string {
        const lines: string[] = [];

        function processObject(obj: any, prefix: string = '') {
            for (const [key, value] of Object.entries(obj)) {
                if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                    processObject(value, prefix ? `${prefix}.${key}` : key);
                } else if (Array.isArray(value)) {
                    lines.push(`${prefix ? prefix + '.' : ''}${key}: ${value.join(', ')}`);
                } else {
                    lines.push(`${prefix ? prefix + '.' : ''}${key}: ${value}`);
                }
            }
        }

        processObject(data);
        return lines.join('\n');
    }

    function copyFlattenedText() {
        if (promptData) {
            const flattened = flattenPrompt(promptData);
            navigator.clipboard.writeText(flattened);
            setCopiedText(true);
            setTimeout(() => setCopiedText(false), 2000);
        }
    }

    function copyCanonicalID() {
        navigator.clipboard.writeText(canonicalId);
        setCopiedID(true);
        setTimeout(() => setCopiedID(false), 2000);
    }

    function parseCanonicalId(id: string) {
        const parts = id.split('__');
        const parsed: Record<string, string> = {};

        parts.forEach(part => {
            const [key, value] = part.split('-');
            parsed[key] = value;
        });

        return parsed;
    }

    if (loading) {
        return (
            <div className="space-y-24 pb-40">
                <div className="flex items-center justify-center h-96">
                    <div className="text-zinc-600 text-lg">Loading prompt...</div>
                </div>
            </div>
        );
    }

    if (!promptData) {
        return (
            <div className="space-y-24 pb-40">
                <Card className="bg-[#050505] border-white/5 p-20">
                    <div className="text-center space-y-6">
                        <FileJson size={64} className="mx-auto text-zinc-700" />
                        <div className="space-y-2">
                            <h3 className="text-2xl font-black text-white">Prompt Not Found</h3>
                            <p className="text-zinc-500">The requested prompt file could not be loaded.</p>
                        </div>
                        <Button onClick={() => router.push('/prompts')} className="bg-white text-black">
                            <ArrowLeft size={16} />
                            Back to Prompts
                        </Button>
                    </div>
                </Card>
            </div>
        );
    }

    const parsed = parseCanonicalId(canonicalId);

    return (
        <div className="space-y-16 pb-40">
            <div className="space-y-8">
                <Button
                    onClick={() => router.push('/prompts')}
                    variant="ghost"
                    className="text-zinc-500 hover:text-white -ml-4"
                >
                    <ArrowLeft size={16} />
                    Back to Prompts
                </Button>

                <div className="space-y-6">
                    <div className="flex items-start justify-between gap-8">
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center">
                                    <FileJson size={28} className="text-green-500" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-mono text-zinc-700 font-bold uppercase tracking-widest">
                                        Merged Prompt JSON
                                    </p>
                                    <h1 className="text-4xl font-black text-white">{canonicalId}</h1>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 flex-wrap">
                                <span className="text-sm font-mono text-zinc-400 bg-zinc-900 px-4 py-2 rounded-lg border border-white/5">
                                    FA: <span className="text-white font-bold">{parsed.FA}</span>
                                </span>
                                <span className="text-sm font-mono text-zinc-400 bg-zinc-900 px-4 py-2 rounded-lg border border-white/5">
                                    BT: <span className="text-white font-bold">{parsed.BT}</span>
                                </span>
                                <span className="text-sm font-mono text-zinc-400 bg-zinc-900 px-4 py-2 rounded-lg border border-white/5">
                                    ET: <span className="text-white font-bold">{parsed.ET}</span>
                                </span>
                                <span className="text-sm font-mono text-zinc-400 bg-zinc-900 px-4 py-2 rounded-lg border border-white/5">
                                    HR: <span className="text-white font-bold">{parsed.HR}</span>
                                </span>
                                <span className="text-sm font-mono text-zinc-400 bg-zinc-900 px-4 py-2 rounded-lg border border-white/5">
                                    SC: <span className="text-white font-bold">{parsed.SC}</span>
                                </span>
                                <span className="text-sm font-mono text-zinc-400 bg-zinc-900 px-4 py-2 rounded-lg border border-white/5">
                                    ST: <span className="text-white font-bold">{parsed.ST}</span>
                                </span>
                                <span className="text-sm font-mono text-zinc-400 bg-zinc-900 px-4 py-2 rounded-lg border border-white/5">
                                    v: <span className="text-white font-bold">{parsed.v}</span>
                                </span>
                                <span className="text-sm font-mono text-zinc-400 bg-zinc-900 px-4 py-2 rounded-lg border border-white/5">
                                    r: <span className="text-white font-bold">{parsed.r}</span>
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <Button
                                onClick={copyJSON}
                                className="h-14 px-8 rounded-2xl bg-white text-black font-black gap-3 shadow-2xl"
                            >
                                {copiedJSON ? (
                                    <>
                                        <Check size={20} />
                                        Copied!
                                    </>
                                ) : (
                                    <>
                                        <Copy size={20} />
                                        Copy JSON
                                    </>
                                )}
                            </Button>

                            <Button
                                onClick={copyFlattenedText}
                                variant="outline"
                                className="h-14 px-8 rounded-2xl font-black gap-3"
                            >
                                {copiedText ? (
                                    <>
                                        <Check size={20} />
                                        Copied!
                                    </>
                                ) : (
                                    <>
                                        <Copy size={20} />
                                        Copy Flattened
                                    </>
                                )}
                            </Button>

                            <Button
                                onClick={copyCanonicalID}
                                variant="ghost"
                                className="h-14 px-8 rounded-2xl font-black gap-3"
                            >
                                {copiedID ? (
                                    <>
                                        <Check size={20} />
                                        Copied!
                                    </>
                                ) : (
                                    <>
                                        <Copy size={20} />
                                        Copy ID
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <Card className="bg-[#050505] border-white/5 overflow-hidden">
                <CardContent className="p-0">
                    <div className="border-b border-white/5 px-8 py-4 bg-zinc-900/50">
                        <p className="text-xs font-mono text-zinc-500 uppercase tracking-wider">
                            Merged JSON Output
                        </p>
                    </div>
                    <div className="h-[600px]">
                        <MonacoEditor
                            height="600px"
                            language="json"
                            theme="vs-dark"
                            value={JSON.stringify(promptData, null, 2)}
                            options={{
                                readOnly: true,
                                minimap: { enabled: false },
                                fontSize: 13,
                                lineNumbers: 'on',
                                scrollBeyondLastLine: false,
                                automaticLayout: true,
                                wordWrap: 'on',
                            }}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
