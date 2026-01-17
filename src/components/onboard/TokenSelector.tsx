"use client";

const SUPPORTED_CHAINS = [
    { id: 42161, name: "Arbitrum" },
    { id: 10, name: "Optimism" },
    { id: 8453, name: "Base" },
    { id: 137, name: "Polygon" },
    { id: 1, name: "Ethereum" },
];

interface TokenSelectorProps {
    label: string;
    selectedChainId: number;
    onChainChange: (chainId: number) => void;
    selectedTokenAddress: string;
    onTokenChange: (address: string) => void;
}

export function TokenSelector({
    label,
    selectedChainId,
    onChainChange,
    selectedTokenAddress,
    onTokenChange
}: TokenSelectorProps) {
    return (
        <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
            <div className="flex gap-2">
                <div className="w-1/3">
                    <select
                        className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        value={selectedChainId}
                        onChange={(e) => onChainChange(Number(e.target.value))}
                    >
                        {SUPPORTED_CHAINS.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                </div>
                <div className="w-2/3">
                    <select
                        className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        value={selectedTokenAddress}
                        onChange={(e) => onTokenChange(e.target.value)}
                    >
                        <option value="0xaf88d065e77c8cC2239327C5EDb3A432268e5831">USDC</option>
                        <option value="0x0000000000000000000000000000000000000000">ETH</option>
                    </select>
                </div>
            </div>
        </div>
    );
}
