import { useMutation } from "@tanstack/react-query";
import { executeRoute, type Route, type RouteExtended, type LiFiStep } from "@lifi/sdk";
import { useWalletClient, useSwitchChain } from "wagmi";

export type ExecutionStatus = "idle" | "preparing" | "executing" | "completed" | "failed" | "success" | "pending" | "error";

interface UseLiFiExecutionProps {
    onProgress?: (route: Route) => void;
}

export function useLiFiExecution({ onProgress }: UseLiFiExecutionProps = {}) {
    const { data: walletClient } = useWalletClient();
    const { switchChainAsync } = useSwitchChain();

    return useMutation({
        // Accept both Route and LiFiStep (quote)
        mutationFn: async (routeOrQuote: Route | LiFiStep) => {
            if (!walletClient) {
                throw new Error("Wallet not connected");
            }

            // Convert LiFiStep to a minimal Route structure if needed
            // executeRoute should handle both, but let's cast for type safety
            const route = routeOrQuote as Route;

            // Execute the route
            const executedRoute = await executeRoute(route, {
                switchChainHook: async (requiredChainId: number) => {
                    console.log("Switching chain to:", requiredChainId);
                    const chain = await switchChainAsync({ chainId: requiredChainId });
                    return walletClient; // Return wallet client after switch
                },
                updateRouteHook: (updatedRoute: Route) => {
                    console.log("Route update:", updatedRoute);
                    if (onProgress) {
                        onProgress(updatedRoute);
                    }
                },
            });

            return executedRoute;
        },
    });
}
