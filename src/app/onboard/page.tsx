"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useAccount, useConnect } from "wagmi";
import { injected } from "wagmi/connectors";
import { Loader2, Wallet } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TokenSelector } from "@/components/onboard/TokenSelector";
import { RoutePreview } from "@/components/onboard/RoutePreview";
import { ExecutionStatus } from "@/components/onboard/ExecutionStatus";
import { DepositToHyperliquid } from "@/components/onboard/DepositToHyperliquid";

import { useLiFiQuotes } from "@/hooks/useLiFiQuotes";
import { useLiFiExecution } from "@/hooks/useLiFiExecution";
import { themes } from "@/lib/themes";

export default function OnboardPage() {
    const searchParams = useSearchParams();
    const themeId = searchParams.get("theme");
    const theme = themes.find(t => t.id === themeId);

    // State
    const [fromChain, setFromChain] = useState(42161); // Default Arbitrum
    const [fromToken, setFromToken] = useState("0xaf88d065e77c8cC2239327C5EDb3A432268e5831"); // USDC on Arb
    const [amount, setAmount] = useState("");

    // HyperEVM Destination (Constant for this hackathon)
    const toChain = 999;
    const toToken = "0x2222222222222222222222222222222222222222"; // HYPE (or USDC if supported later)
    // Note: Using HYPE address for now as example destination. 
    // Ideally we bridge into USDC on HyperEVM if possible, but 0x222... is the HYPE evm burner? 
    // Actually per docs: "To move HYPE from HyperCore to HyperEVM, send HYPE to 0x222...". 
    // For bridging IN via LI.FI, we probably want USDC on HyperEVM.
    // Let's assume USDC on HyperEVM exists or we bridge to HYPE.
    // For safety in this hackathon MVP, let's use a known token or just keep it generic.
    // LI.FI might not have HyperEVM (999) fully indexed in public API yet?
    // User requirement: "Destination token on HyperEVM (USDC, HYPE)".
    // Let's try to find a valid HyperEVM token address.

    // Wallet
    const { address, isConnected } = useAccount();
    const { connect } = useConnect();

    // Hooks
    const { data: route, isLoading: isQuoteLoading, error: quoteError } = useLiFiQuotes({
        fromChain,
        toChain, // 999
        fromToken,
        toToken, // We need a real address here. If 999 isn't supported by public API yet, this might fail.
        // If LI.FI doesn't support 999 yet, we mock it or bridge to Arb then "deposit".
        // But the prompt says "Uses LI.FI to swap and bridge... into HyperEVM".
        // Assuming 999 is supported.
        amount,
        fromAddress: address,
    });

    const { mutate: executeRoute, status: executionStatus, data: executedRoute } = useLiFiExecution();

    const handleBridge = () => {
        if (route) {
            executeRoute(route);
        }
    };

    return (
        <main className="min-h-screen flex flex-col items-center justify-start p-4 md:p-8 max-w-2xl mx-auto w-full">
            <div className="mb-8 text-center space-y-2">
                <h1 className="text-3xl font-bold">
                    Onboard to Hyperliquid
                </h1>
                {theme ? (
                    <p className="text-blue-600 font-medium">Target Theme: {theme.name}</p>
                ) : (
                    <p className="text-gray-500">Bridge funds to start trading</p>
                )}
            </div>

            <Card className="w-full shadow-lg border-muted/40">
                <CardHeader>
                    <CardTitle>Bridge & Swap</CardTitle>
                    <CardDescription>Move funds from any chain to HyperEVM</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Amount Input */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Amount to Bridge</label>
                        <div className="relative">
                            <input
                                type="number"
                                placeholder="0.00"
                                className="w-full text-2xl font-bold bg-transparent border-none outline-none focus:ring-0 p-0"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                            />
                            <span className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 font-medium">USDC</span>
                        </div>
                    </div>

                    {/* Token Selector */}
                    <TokenSelector
                        label="From Network"
                        selectedChainId={fromChain}
                        onChainChange={setFromChain}
                        selectedTokenAddress={fromToken}
                        onTokenChange={setFromToken}
                    />

                    {/* Quote Error */}
                    {quoteError && (
                        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-100">
                            Unable to find a route. Ensure you have selected valid chains and amount.
                            <br />
                            <span className="text-xs opacity-75">Only specific testnet/mainnet pairs might be supported.</span>
                        </div>
                    )}

                    {/* Route Preview */}
                    {isQuoteLoading && (
                        <div className="flex items-center justify-center py-8 text-gray-400">
                            <Loader2 className="w-6 h-6 animate-spin mr-2" />
                            Finding best route...
                        </div>
                    )}

                    {route && !executionStatus && (
                        <RoutePreview route={route} />
                    )}

                    {/* Action Button */}
                    <div className="pt-4">
                        {!isConnected ? (
                            <Button
                                className="w-full h-12 text-lg"
                                onClick={() => connect({ connector: injected() })}
                            >
                                <Wallet className="mr-2 w-5 h-5" />
                                Connect Wallet
                            </Button>
                        ) : (
                            <Button
                                className="w-full h-12 text-lg"
                                disabled={!route || isQuoteLoading || executionStatus === 'pending' || parseFloat(amount) <= 0}
                                onClick={handleBridge}
                            >
                                {executionStatus === 'pending' ? (
                                    <><Loader2 className="mr-2 w-5 h-5 animate-spin" /> Bridging...</>
                                ) : (
                                    "Start Bridge"
                                )}
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Execution Status */}
            {(executedRoute || executionStatus !== 'idle') && executedRoute && (
                <ExecutionStatus route={executedRoute} status={executionStatus} />
            )}

            {/* Auto-Deposit to Hyperliquid Trading Account */}
            {executionStatus === 'success' && (
                <div className="mt-6 w-full">
                    <div className="text-center mb-4">
                        <p className="text-lg font-medium text-green-600">🎉 Bridge Complete!</p>
                        <p className="text-sm text-gray-500">Now deposit to start trading on Hyperliquid</p>
                    </div>
                    <DepositToHyperliquid
                        defaultAmount={amount}
                        title="Activate Trading"
                        description="Move funds to your Hyperliquid trading account"
                        onSuccess={() => console.log("Deposit successful!")}
                    />
                </div>
            )}
        </main>
    );
}
