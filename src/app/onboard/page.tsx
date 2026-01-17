"use client";

import { LiFiWidget } from "@lifi/widget";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function OnboardContent() {
    const searchParams = useSearchParams();
    const theme = searchParams.get("theme");

    return (
        <main className="min-h-screen flex flex-col items-center justify-start p-8">
            <h1 className="text-3xl font-bold mb-2">
                Onboard to Hyperliquid {theme ? `(${theme.toUpperCase()})` : ""}
            </h1>

            <p className="text-gray-500 mb-6">
                Bridge funds from any chain into HyperEVM using LI.FI.
            </p>

            <div className="w-full max-w-2xl">
                <LiFiWidget
                    integrator="brunelonchain"
                    config={{
                        variant: "wide",
                        toChain: 999, // HyperEVM Chain ID
                        appearance: "light",
                        theme: {
                            container: {
                                border: "1px solid rgb(234, 234, 234)",
                                borderRadius: "16px",
                            },
                        },
                    }}
                />
            </div>
        </main>
    );
}

export default function OnboardPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <OnboardContent />
        </Suspense>
    );
}
