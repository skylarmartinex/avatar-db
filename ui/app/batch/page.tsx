"use client";
import { useEffect, useState } from 'react';
import { Layers, Loader2, Play, Download, Table as TableIcon, FileText, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

export default function BatchPage() {
    const [loading, setLoading] = useState(false);
    const [batchName, setBatchName] = useState('ui_batch_01');
    const [version, setVersion] = useState('01');
    const [runs, setRuns] = useState(1);
    const [preset, setPreset] = useState('face_pass');
    const [manifest, setManifest] = useState<any[]>([]);
    const [output, setOutput] = useState('');

    async function handleBatch() {
        setLoading(true);
        setManifest([]);
        try {
            const res = await fetch('/api/batch', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    batch_name: batchName,
                    v: version,
                    runs,
                    preset: preset || undefined
                })
            });
            const data = await res.json();
            setOutput(data.output || data.error);

            if (data.success) {
                const match = data.output.match(/Manifest: (.*)/);
                if (match) {
                    const path = match[1].trim();
                    const mRes = await fetch(`/api/manifest?path=${encodeURIComponent(path)}`);
                    const mData = await mRes.json();
                    setManifest(mData);
                }
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-500 pb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-zinc-900">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-purple-500 uppercase tracking-widest">
                        <Layers size={14} />
                        Bulk Synthesis
                    </div>
                    <h1 className="text-5xl font-extrabold tracking-tight text-white leading-tight">
                        Batch Processor
                    </h1>
                    <p className="text-zinc-500 text-lg max-w-xl">
                        Execute large-scale prompt generation using presets or custom grid combinations.
                    </p>
                </div>

                <Button
                    size="lg"
                    onClick={handleBatch}
                    disabled={loading}
                    className="h-14 px-10 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500"
                >
                    {loading ? <Loader2 className="mr-3 animate-spin" size={20} /> : <Play className="mr-3" size={20} fill="currentColor" />}
                    {loading ? "Processing Batch..." : "Run Global Batch"}
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1 space-y-6">
                    <Card className="rounded-3xl border-zinc-800 bg-[#0a0a0a] overflow-hidden shadow-xl">
                        <CardHeader className="p-6 border-b border-zinc-900 bg-zinc-900/20">
                            <CardTitle className="text-sm font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                                Configuration
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 space-y-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest px-1">Active Preset</label>
                                <select
                                    className="w-full bg-black border border-zinc-800 p-3 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all text-sm font-bold text-white"
                                    value={preset}
                                    onChange={e => setPreset(e.target.value)}
                                >
                                    <option value="face_pass">Face Pass (All FA + ET)</option>
                                    <option value="">Custom Grid (Advanced)</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest px-1">Nominal Batch ID</label>
                                <input
                                    type="text"
                                    className="w-full bg-black border border-zinc-800 p-3 rounded-xl text-sm font-mono focus:ring-1 focus:ring-purple-500 transition-all outline-none"
                                    value={batchName}
                                    onChange={e => setBatchName(e.target.value)}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest px-1">Version</label>
                                    <input
                                        type="text"
                                        className="w-full bg-black border border-zinc-800 p-3 rounded-xl text-sm font-mono focus:ring-1 focus:ring-purple-500 transition-all outline-none"
                                        value={version}
                                        onChange={e => setVersion(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest px-1">Runs/Cell</label>
                                    <input
                                        type="number"
                                        className="w-full bg-black border border-zinc-800 p-3 rounded-xl text-sm font-mono focus:ring-1 focus:ring-purple-500 transition-all outline-none"
                                        value={runs}
                                        onChange={e => setRuns(parseInt(e.target.value))}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-2xl border-purple-500/10 bg-purple-500/5">
                        <CardContent className="p-6">
                            <div className="flex gap-4">
                                <div className="p-3 bg-purple-500/10 rounded-xl h-fit">
                                    <TableIcon size={20} className="text-purple-400" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-purple-300">Deterministic Grid</p>
                                    <p className="text-[11px] text-purple-400/70 leading-relaxed italic">Presets ensure standardized comparisons across specific module categories.</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="md:col-span-2 space-y-6">
                    <Card className="rounded-[2.5rem] border-zinc-800 bg-[#050505] min-h-[400px] flex flex-col overflow-hidden shadow-2xl">
                        <div className="p-8 border-b border-zinc-900 bg-zinc-900/10 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className={cn("w-2 h-2 rounded-full", manifest.length > 0 ? "bg-emerald-500" : "bg-zinc-800")} />
                                <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-zinc-400">Live Manifest View</h2>
                            </div>
                            {manifest.length > 0 && (
                                <Button variant="outline" size="sm" className="h-8 rounded-lg gap-2 text-[10px] font-black uppercase tracking-wider">
                                    <Download size={14} />
                                    Export CSV
                                </Button>
                            )}
                        </div>

                        <div className="flex-1 overflow-auto custom-scrollbar">
                            {manifest.length > 0 ? (
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-zinc-950/50">
                                            <TableHead>Output ID</TableHead>
                                            <TableHead>FA</TableHead>
                                            <TableHead>BT</TableHead>
                                            <TableHead>ST</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {manifest.slice(0, 50).map((row, i) => (
                                            <TableRow key={i} className="group">
                                                <TableCell className="font-mono text-[10px] text-zinc-500 group-hover:text-zinc-300 transition-colors uppercase tracking-tighter">
                                                    {row.output_id.split('__v')[0].substring(0, 20)}...
                                                </TableCell>
                                                <TableCell className="font-bold text-xs">{row.FA}</TableCell>
                                                <TableCell className="text-xs text-zinc-400">{row.BT}</TableCell>
                                                <TableCell className="text-xs text-zinc-400">{row.ST}</TableCell>
                                                <TableCell className="text-right">
                                                    <button className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-600 hover:text-white transition-all">
                                                        <FileText size={14} />
                                                    </button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center p-20 gap-6 opacity-30">
                                    <TableIcon size={64} className="stroke-[1px]" />
                                    <div className="text-center space-y-1">
                                        <p className="font-bold text-lg uppercase tracking-tight">Manifest Empty</p>
                                        <p className="text-xs italic">Initiate a batch to view the generated run manifest.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </Card>

                    {manifest.length > 50 && (
                        <p className="text-center text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
                            Limited to first 50 of {manifest.length} records.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
