"use client";

import { Route, LiFiStep } from "@lifi/sdk";
import { Clock, Fuel } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface RoutePreviewProps {
    route: Route | LiFiStep;
}

export function RoutePreview({ route }: RoutePreviewProps) {
    const step = 'steps' in route ? route.steps[0] : route;
    const tool = step.toolDetails;
    const estimate = step.estimate;

    const formatUSD = (val?: string | number) => {
        if (!val) return "$0.00";
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(Number(val));
    };

    const toAmount = estimate.toAmount;
    const toAmountUSD = estimate.toAmountUSD;
    const gasCostUSD = estimate.gasCosts?.reduce((acc, gc) => acc + Number(gc.amountUSD || 0), 0) || 0;

    return (
        <Card className="mt-6 border-blue-100 bg-blue-50/20 dark:border-blue-900/30 dark:bg-blue-900/10">
            <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex flex-col">
                        <span className="text-sm text-gray-500">Receive</span>
                        <span className="text-2xl font-bold">
                            {(Number(toAmount) / 1e6).toFixed(4)} <span className="text-sm font-normal text-gray-500">USDC</span>
                        </span>
                        <span className="text-xs text-gray-400">
                            ≈ {formatUSD(toAmountUSD)}
                        </span>
                    </div>
                    <div className="text-right">
                        <div className="flex items-center gap-1 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded-md">
                            <img src={tool.logoURI} alt={tool.name} className="w-4 h-4 rounded-full" />
                            {tool.name}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm border-t pt-4">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <Fuel className="w-4 h-4" />
                        <span>Gas Cost</span>
                    </div>
                    <div className="text-right font-medium">
                        {formatUSD(gasCostUSD)}
                    </div>

                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <Clock className="w-4 h-4" />
                        <span>Est. Time</span>
                    </div>
                    <div className="text-right font-medium">
                        {Math.ceil(estimate.executionDuration / 60)} min
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
