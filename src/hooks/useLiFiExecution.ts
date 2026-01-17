import { useMutation } from "@tanstack/react-query";
import { executeRoute, type Route, type LiFiStep } from "@lifi/sdk";
import { useWalletClient, useSwitchChain } from "wagmi";

export type ExecutionStatus = "idle" | "preparing" | "executing" | "completed" | "failed" | "success" | "pending" | "error";

interface UseLiFiExecutionProps {
    onProgress?: (route: Route) => void;
}

export function useLiFiExecution({ onProgress }: UseLiFiExecutionProps = {}) {
    const { data: walletClient } = useWalletClient();
    const { switchChainAsync } = useSwitchChain();

    return useMutation({
        mutationFn: async (routeOrQuote: Route | LiFiStep) => {
            if (!walletClient) {
                throw new Error("Wallet not connected");
            }

            const route = routeOrQuote as Route;

            const executedRoute = await executeRoute(route, {
                switchChainHook: async (requiredChainId: number) => {
                    await switchChainAsync({ chainId: requiredChainId });
                    return walletClient;
                },
                updateRouteHook: (updatedRoute: Route) => {
                    if (onProgress) {
                        onProgress(updatedRoute);
                    }
                },
            });

            return executedRoute;
        },
    });
}
