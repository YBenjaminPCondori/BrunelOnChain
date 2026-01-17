"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { Loader2, CheckCircle2, AlertCircle, ArrowRight, Wallet } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { useHyperliquidDeposit } from "@/hooks/useHyperliquidDeposit";

interface DepositToHyperliquidProps {
    /** Pre-fill the amount (e.g., from a previous bridge transaction) */
    defaultAmount?: string;
    /** Called when deposit is successful */
    onSuccess?: () => void;
    /** Called when deposit fails */
    onError?: (error: Error) => void;
    /** Use testnet instead of mainnet */
    isTestnet?: boolean;
    /** Custom title for the card */
    title?: string;
    /** Custom description */
    description?: string;
}

/**
 * Reusable component for depositing USDC to Hyperliquid trading account.
 * 
 * This component can be used by any team integrating with Hyperliquid.
 * It handles:
 * - USDC approval to the Bridge2 contract
 * - Deposit transaction to Hyperliquid
 * - Loading and error states
 * - Minimum deposit validation (5 USDC)
 * 
 * @example
 * <DepositToHyperliquid 
 *   defaultAmount="100"
 *   onSuccess={() => console.log("Deposited!")}
 * />
 */
export function DepositToHyperliquid({
    defaultAmount = "",
    onSuccess,
    onError,
    isTestnet = false,
    title = "Deposit to Hyperliquid",
    description = "Transfer funds to your trading account",
}: DepositToHyperliquidProps) {
    const [amount, setAmount] = useState(defaultAmount);
    const { address, isConnected } = useAccount();

    const {
        deposit,
        isLoading,
        isSuccess,
        isError,
        error,
        usdcBalance,
        minDeposit,
    } = useHyperliquidDeposit({
        isMainnet: !isTestnet,
        onSuccess,
        onError,
    });

    const handleDeposit = () => {
        if (amount && parseFloat(amount) >= minDeposit) {
            deposit(amount);
        }
    };

    const isValidAmount = parseFloat(amount) >= minDeposit;
    const hasEnoughBalance = usdcBalance >= parseFloat(amount || "0");

    return (
        <Card className="w-full max-w-md border-green-100 bg-green-50/30 dark:border-green-900/30 dark:bg-green-900/10">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                        <ArrowRight className="w-4 h-4 text-white" />
                    </div>
                    {title}
                </CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Amount Input */}
                <div className="space-y-2">
                    <label className="text-sm font-medium">Amount (USDC)</label>
                    <div className="relative">
                        <input
                            type="number"
                            min={minDeposit}
                            step="0.01"
                            placeholder={`Min ${minDeposit} USDC`}
                            className="w-full h-12 px-4 text-lg font-medium rounded-lg border bg-background focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            disabled={isLoading || isSuccess}
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-500">USDC</span>
                    </div>
                    {isConnected && (
                        <p className="text-xs text-gray-500">
                            Balance: {usdcBalance.toFixed(2)} USDC on Arbitrum
                        </p>
                    )}
                </div>

                {/* Validation Messages */}
                {amount && !isValidAmount && (
                    <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 p-2 rounded-md">
                        <AlertCircle className="w-4 h-4" />
                        Minimum deposit is {minDeposit} USDC
                    </div>
                )}

                {amount && isValidAmount && !hasEnoughBalance && (
                    <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-2 rounded-md">
                        <AlertCircle className="w-4 h-4" />
                        Insufficient USDC balance
                    </div>
                )}

                {/* Error Message */}
                {isError && error && (
                    <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-md">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        <span>{error.message}</span>
                    </div>
                )}

                {/* Success Message */}
                {isSuccess && (
                    <div className="flex items-center gap-2 text-sm text-green-600 bg-green-100 p-3 rounded-md">
                        <CheckCircle2 className="w-4 h-4" />
                        Deposit successful! Funds will appear in your Hyperliquid account within 1 minute.
                    </div>
                )}
            </CardContent>

            <CardFooter className="flex flex-col gap-2">
                {!isConnected ? (
                    <Button className="w-full" disabled>
                        <Wallet className="mr-2 w-4 h-4" />
                        Connect Wallet First
                    </Button>
                ) : isSuccess ? (
                    <Button className="w-full bg-green-600 hover:bg-green-700" disabled>
                        <CheckCircle2 className="mr-2 w-4 h-4" />
                        Deposited Successfully
                    </Button>
                ) : (
                    <Button
                        className="w-full bg-green-600 hover:bg-green-700"
                        onClick={handleDeposit}
                        disabled={!isValidAmount || !hasEnoughBalance || isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                                Depositing...
                            </>
                        ) : (
                            <>
                                <ArrowRight className="mr-2 w-4 h-4" />
                                Deposit to Hyperliquid
                            </>
                        )}
                    </Button>
                )}

                <p className="text-xs text-center text-gray-500">
                    Funds are credited in ~1 minute via Hyperliquid Bridge
                </p>
            </CardFooter>
        </Card>
    );
}
