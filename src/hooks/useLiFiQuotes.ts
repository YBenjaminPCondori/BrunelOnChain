import { useQuery } from "@tanstack/react-query";
import { getQuote, type QuoteRequest, type Route } from "@lifi/sdk";
import { parseUnits } from "viem";

interface UseLiFiQuotesProps {
    fromChain: number;
    toChain: number;
    fromToken: string;
    toToken: string;
    fromAddress?: string;
    amount: string; // User input string (e.g. "10.5")
}

export function useLiFiQuotes({
    fromChain,
    toChain,
    fromToken,
    toToken,
    fromAddress,
    amount,
}: UseLiFiQuotesProps) {
    return useQuery({
        queryKey: [
            "lifi-quote",
            fromChain,
            toChain,
            fromToken,
            toToken,
            amount,
            fromAddress,
        ],
        queryFn: async () => {
            if (!amount || parseFloat(amount) <= 0) return null;
            if (!fromToken || !toToken) return null;

            // Note: In production, you'd fetch decimals dynamically.
            // For MVP, we'll assume USDC (6 decimals) or use standard 18.
            // Ideally, pass decimals as prop or fetch token info first.
            // For this hackathon, let's try to be safe.
            // If it's USDC, use 6, else 18.
            const isUSDC =
                fromToken.toLowerCase().includes("a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48") || // Mainnet
                fromToken.toLowerCase().includes("af88d065e77c8cc2239327c5edb3a432268e5831"); // Arbitrum

            const decimals = isUSDC ? 6 : 18;
            const rawAmount = parseUnits(amount, decimals).toString();

            const quoteRequest: QuoteRequest = {
                fromChain,
                toChain,
                fromToken,
                toToken,
                fromAmount: rawAmount,
                fromAddress: fromAddress, // Undefined is better than empty string
            };

            const quote = await getQuote(quoteRequest);
            return quote;
        },
        enabled: !!amount && parseFloat(amount) > 0 && !!fromToken && !!toToken,
        retry: false,
    });
}
