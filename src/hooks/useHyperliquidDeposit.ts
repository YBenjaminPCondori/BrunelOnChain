"use client";

import { useMutation } from "@tanstack/react-query";
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useSwitchChain, useReadContract } from "wagmi";
import { parseUnits } from "viem";
import { HYPERLIQUID_BRIDGE_CONFIG, ERC20_ABI, BRIDGE2_ABI } from "@/lib/hyperliquid";

export type DepositStatus = "idle" | "approving" | "depositing" | "success" | "error";

interface UseHyperliquidDepositOptions {
    isMainnet?: boolean;
    onSuccess?: () => void;
    onError?: (error: Error) => void;
}

export function useHyperliquidDeposit(options: UseHyperliquidDepositOptions = {}) {
    const { isMainnet = true, onSuccess, onError } = options;
    const config = isMainnet ? HYPERLIQUID_BRIDGE_CONFIG.mainnet : HYPERLIQUID_BRIDGE_CONFIG.testnet;

    const { address } = useAccount();
    const { switchChainAsync } = useSwitchChain();
    const { writeContractAsync } = useWriteContract();

    // Check current allowance
    const { data: currentAllowance, refetch: refetchAllowance } = useReadContract({
        address: config.usdcAddress,
        abi: ERC20_ABI,
        functionName: "allowance",
        args: address ? [address, config.bridgeAddress] : undefined,
        query: {
            enabled: !!address,
        },
    });

    // Check USDC balance
    const { data: usdcBalance, refetch: refetchBalance } = useReadContract({
        address: config.usdcAddress,
        abi: ERC20_ABI,
        functionName: "balanceOf",
        args: address ? [address] : undefined,
        query: {
            enabled: !!address,
        },
    });

    const depositMutation = useMutation({
        mutationFn: async (amount: string) => {
            if (!address) throw new Error("Wallet not connected");

            const amountInDecimals = parseUnits(amount, 6); // USDC has 6 decimals

            // Validate minimum deposit
            if (parseFloat(amount) < config.minDeposit) {
                throw new Error(`Minimum deposit is ${config.minDeposit} USDC`);
            }

            // Ensure we're on Arbitrum
            await switchChainAsync({ chainId: config.chainId });

            // Step 1: Check and approve if needed
            const allowance = currentAllowance ?? BigInt(0);
            if (allowance < amountInDecimals) {
                console.log("Approving USDC spend...");
                const approveTx = await writeContractAsync({
                    address: config.usdcAddress,
                    abi: ERC20_ABI,
                    functionName: "approve",
                    args: [config.bridgeAddress, amountInDecimals],
                });
                console.log("Approval tx:", approveTx);
                // Wait for approval confirmation could be added here
            }

            // Step 2: Deposit to bridge
            // The Bridge2 contract expects amount in "usd" which is uint64 representing the amount in USDC
            // Since USDC has 6 decimals, we need to convert properly
            const usdAmount = BigInt(parseFloat(amount) * 1e6); // Convert to uint64 format

            console.log("Depositing to Hyperliquid bridge...");
            const depositTx = await writeContractAsync({
                address: config.bridgeAddress,
                abi: BRIDGE2_ABI,
                functionName: "deposit",
                args: [address, usdAmount],
            });

            console.log("Deposit tx:", depositTx);
            return depositTx;
        },
        onSuccess: () => {
            refetchBalance();
            refetchAllowance();
            onSuccess?.();
        },
        onError: (error: Error) => {
            console.error("Deposit error:", error);
            onError?.(error);
        },
    });

    return {
        deposit: depositMutation.mutate,
        depositAsync: depositMutation.mutateAsync,
        isLoading: depositMutation.isPending,
        isSuccess: depositMutation.isSuccess,
        isError: depositMutation.isError,
        error: depositMutation.error,
        usdcBalance: usdcBalance ? Number(usdcBalance) / 1e6 : 0,
        minDeposit: config.minDeposit,
        bridgeAddress: config.bridgeAddress,
    };
}
