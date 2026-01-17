"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { injected } from "wagmi/connectors";
import { Loader2, Wallet, RefreshCw, LogOut } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TokenSelector } from "@/components/onboard/TokenSelector";
import { RoutePreview } from "@/components/onboard/RoutePreview";
import { ExecutionStatus } from "@/components/onboard/ExecutionStatus";
import { DepositToHyperliquid } from "@/components/onboard/DepositToHyperliquid";

import { useLiFiQuotes } from "@/hooks/useLiFiQuotes";
import { useLiFiExecution } from "@/hooks/useLiFiExecution";
import { themes } from "@/lib/themes";

function OnboardContent() {
    const searchParams = useSearchParams();
    const themeId = searchParams.get("theme");
    const theme = themes.find(t => t.id === themeId);

    // State
    const [fromChain, setFromChain] = useState(42161); // Default Arbitrum
    const [fromToken, setFromToken] = useState("0xaf88d065e77c8cC2239327C5EDb3A432268e5831"); // USDC on Arb
    const [amount, setAmount] = useState("");

    // HyperEVM Destination
    const toChain = 42161; // Using Arbitrum as destination for demo (999 might not be indexed yet)
    const toToken = "0xaf88d065e77c8cC2239327C5EDb3A432268e5831"; // USDC

    // Wallet
    const { address, isConnected } = useAccount();
    const { connect } = useConnect();
    const { disconnect } = useDisconnect();

    // Hooks
    const {
        data: route,
        isLoading: isQuoteLoading,
        error: quoteError,
        refetch: refetchQuote
    } = useLiFiQuotes({
        fromChain,
        toChain,
        fromToken,
        toToken,
        amount,
        fromAddress: address,
    });

    const {
        mutate: executeRoute,
        status: executionStatus,
        data: executedRoute,
        error: executionError
    } = useLiFiExecution({
        onProgress: (updatedRoute) => {
            toast.info("Transaction progressing...");
        }
    });

    const handleBridge = () => {
        if (route) {
            toast.loading("Starting bridge transaction...", { id: "bridge" });
            executeRoute(route, {
                onSuccess: () => {
                    toast.success("Bridge completed successfully!", { id: "bridge" });
                },
                onError: (error) => {
                    toast.error(`Bridge failed: ${error.message}`, { id: "bridge" });
                }
            });
        }
    };

    const handleRetry = () => {
        toast.info("Fetching new quote...");
        refetchQuote();
    };

    const handleConnect = () => {
        toast.loading("Connecting wallet...", { id: "connect" });
        connect({ connector: injected() }, {
            onSuccess: () => {
                toast.success("Wallet connected!", { id: "connect" });
            },
            onError: (error) => {
                toast.error(`Connection failed: ${error.message}`, { id: "connect" });
            }
        });
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

            {/* Wallet Status Bar */}
            {isConnected && (
                <div className="w-full mb-4 flex items-center justify-between px-4 py-2 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-sm font-medium">
                            {address?.slice(0, 6)}...{address?.slice(-4)}
                        </span>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                            disconnect();
                            toast.info("Wallet disconnected");
                        }}
                        className="text-gray-500 hover:text-red-500"
                    >
                        <LogOut className="w-4 h-4" />
                    </Button>
                </div>
            )}

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

                    {/* Quote Error with Retry */}
                    {quoteError && (
                        <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-md border border-red-100 dark:border-red-800">
                            <div className="flex items-center justify-between">
                                <span>Unable to find a route. Please try again.</span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleRetry}
                                    className="ml-2"
                                >
                                    <RefreshCw className="w-4 h-4 mr-1" />
                                    Retry
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Route Preview */}
                    {isQuoteLoading && (
                        <div className="flex items-center justify-center py-8 text-gray-400">
                            <Loader2 className="w-6 h-6 animate-spin mr-2" />
                            Finding best route...
                        </div>
                    )}

                    {route && executionStatus !== 'pending' && executionStatus !== 'success' && (
                        <RoutePreview route={route} />
                    )}

                    {/* Action Button */}
                    <div className="pt-4">
                        {!isConnected ? (
                            <Button
                                className="w-full h-12 text-lg"
                                onClick={handleConnect}
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
            {executedRoute && (
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
                        onSuccess={() => toast.success("Deposit to Hyperliquid complete!")}
                    />
                </div>
            )}
        </main>
    );
}

export default function OnboardPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="w-8 h-8 animate-spin" /></div>}>
            <OnboardContent />
        </Suspense>
    );
}
