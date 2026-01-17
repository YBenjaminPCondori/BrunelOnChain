import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"; // Note: Need to check if shadcn command is installed? If not, we'll use basic select.
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"; // Need to check if popover is installed.

// Fallback simple selector if shadcn components missing
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export interface ChainOption {
    id: number;
    name: string;
    logoURI?: string;
}

export interface TokenOption {
    address: string;
    symbol: string;
    name: string;
    decimals: number;
    logoURI?: string;
}

const SUPPORTED_CHAINS = [
    { id: 42161, name: "Arbitrum" },
    { id: 10, name: "Optimism" },
    { id: 8453, name: "Base" },
    { id: 137, name: "Polygon" },
    { id: 1, name: "Ethereum" },
];

const COMMON_TOKENS = [
    { symbol: "USDC", address: "0xaf88d065e77c8cc2239327c5edb3a432268e5831", name: "USD Coin", decimals: 6, chainId: 42161 }, // Arb
    { symbol: "ETH", address: "0x0000000000000000000000000000000000000000", name: "Ether", decimals: 18, chainId: 42161 },
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
                {/* Chain Selector */}
                <div className="w-1/3">
                    <select
                        className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        value={selectedChainId}
                        onChange={(e) => onChainChange(Number(e.target.value))}
                    >
                        {SUPPORTED_CHAINS.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                </div>

                {/* Token Selector - Simplified for MVP */}
                <div className="w-2/3">
                    <select
                        className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        value={selectedTokenAddress}
                        onChange={(e) => onTokenChange(e.target.value)}
                    >
                        {/* Mocking dynamic tokens for now */}
                        {selectedChainId === 42161 ? (
                            <>
                                <option value="0xaf88d065e77c8cC2239327C5EDb3A432268e5831">USDC</option>
                                <option value="0x0000000000000000000000000000000000000000">ETH</option>
                            </>
                        ) : (
                            <option value="" disabled>Select Chain First</option>
                        )}
                    </select>
                </div>
            </div>
        </div>
    );
}
