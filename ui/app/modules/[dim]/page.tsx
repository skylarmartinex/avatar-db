"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function DimensionPage() {
    const { dim } = useParams();
    const [registryData, setRegistryData] = useState<Record<string, any>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/registry')
            .then(res => res.json())
            .then(data => {
                setRegistryData(data[dim as string] || {});
                setLoading(false);
            });
    }, [dim]);

    if (loading) return <div>Loading...</div>;

    const codes = Object.keys(registryData);

    return (
        <div>
            <div className="mb-8">
                <Link href="/modules" className="text-sm text-muted-foreground hover:text-primary">← Back to Dimensions</Link>
                <h1 className="text-3xl font-bold mt-2">Modules: {dim}</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {codes.map((code) => (
                    <Link
                        key={code}
                        href={`/modules/${dim}/${code}`}
                        className="p-6 border border-zinc-800 rounded-xl hover:border-primary bg-zinc-900/50 transition-all flex flex-col gap-2"
                    >
                        <div className="text-xs font-mono text-muted-foreground">{code}</div>
                        <div className="font-bold text-lg">{registryData[code].label || code}</div>
                        {registryData[code].description && (
                            <div className="text-sm text-muted-foreground line-clamp-2 italic">
                                "{registryData[code].description}"
                            </div>
                        )}
                    </Link>
                ))}
            </div>
        </div>
    );
}
