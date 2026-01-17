"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode, useState } from "react";
import { http, createConfig, WagmiProvider } from "wagmi";
import { arbitrum, mainnet, optimism, polygon, base } from "wagmi/chains";
import { Toaster } from "sonner";

export const config = createConfig({
    chains: [mainnet, arbitrum, optimism, polygon, base],
    transports: {
        [mainnet.id]: http(),
        [arbitrum.id]: http(),
        [optimism.id]: http(),
        [polygon.id]: http(),
        [base.id]: http(),
    },
});

export function Providers({ children }: { children: ReactNode }) {
    const [queryClient] = useState(() => new QueryClient());

    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                {children}
                <Toaster
                    position="top-right"
                    richColors
                    closeButton
                    toastOptions={{
                        style: {
                            background: 'hsl(var(--background))',
                            color: 'hsl(var(--foreground))',
                            border: '1px solid hsl(var(--border))',
                        },
                    }}
                />
            </QueryClientProvider>
        </WagmiProvider>
    );
}
