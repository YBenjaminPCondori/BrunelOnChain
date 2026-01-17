"use client";

import { useMutation } from "@tanstack/react-query";
import { useAccount, useWriteContract, useSwitchChain, useReadContract } from "wagmi";
import { parseUnits } from "viem";
import { HYPERLIQUID_BRIDGE_CONFIG, ERC20_ABI, BRIDGE2_ABI } from "@/lib/hyperliquid";

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

    const { data: currentAllowance, refetch: refetchAllowance } = useReadContract({
        address: config.usdcAddress,
        abi: ERC20_ABI,
        functionName: "allowance",
        args: address ? [address, config.bridgeAddress] : undefined,
        query: { enabled: !!address },
    });

    const { data: usdcBalance, refetch: refetchBalance } = useReadContract({
        address: config.usdcAddress,
        abi: ERC20_ABI,
        functionName: "balanceOf",
        args: address ? [address] : undefined,
        query: { enabled: !!address },
    });

    const depositMutation = useMutation({
        mutationFn: async (amount: string) => {
            if (!address) throw new Error("Wallet not connected");

            const amountInDecimals = parseUnits(amount, 6);

            if (parseFloat(amount) < config.minDeposit) {
                throw new Error(`Minimum deposit is ${config.minDeposit} USDC`);
            }

            await switchChainAsync({ chainId: config.chainId });

            const allowance = currentAllowance ?? BigInt(0);
            if (allowance < amountInDecimals) {
                await writeContractAsync({
                    address: config.usdcAddress,
                    abi: ERC20_ABI,
                    functionName: "approve",
                    args: [config.bridgeAddress, amountInDecimals],
                });
            }

            const usdAmount = BigInt(parseFloat(amount) * 1e6);

            const depositTx = await writeContractAsync({
                address: config.bridgeAddress,
                abi: BRIDGE2_ABI,
                functionName: "deposit",
                args: [address, usdAmount],
            });

            return depositTx;
        },
        onSuccess: () => {
            refetchBalance();
            refetchAllowance();
            onSuccess?.();
        },
        onError: (error: Error) => {
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
