import { useQuery } from "@tanstack/react-query";
import { getQuote, type QuoteRequest } from "@lifi/sdk";
import { parseUnits } from "viem";

interface UseLiFiQuotesProps {
    fromChain: number;
    toChain: number;
    fromToken: string;
    toToken: string;
    fromAddress?: string;
    amount: string;
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
        queryKey: ["lifi-quote", fromChain, toChain, fromToken, toToken, amount, fromAddress],
        queryFn: async () => {
            if (!amount || parseFloat(amount) <= 0) return null;
            if (!fromToken || !toToken) return null;

            const isUSDC = fromToken.toLowerCase().includes("af88d065e77c8cc2239327c5edb3a432268e5831");
            const decimals = isUSDC ? 6 : 18;
            const rawAmount = parseUnits(amount, decimals).toString();

            const quoteRequest: QuoteRequest = {
                fromChain,
                toChain,
                fromToken,
                toToken,
                fromAmount: rawAmount,
                fromAddress,
            };

            const quote = await getQuote(quoteRequest);
            return quote;
        },
        enabled: !!amount && parseFloat(amount) > 0 && !!fromToken && !!toToken,
        retry: false,
    });
}
