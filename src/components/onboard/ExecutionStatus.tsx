import { Route, RouteExtended } from "@lifi/sdk";
import { CheckCircle2, Loader2, Circle, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ExecutionStatusProps {
    route: RouteExtended;
    status: "idle" | "preparing" | "executing" | "completed" | "failed" | "success" | "pending" | "error";
}

export function ExecutionStatus({ route, status }: ExecutionStatusProps) {
    const steps = route.steps;

    // Helper to get status icon
    const getStepStatusIcon = (stepStatus: string) => {
        switch (stepStatus) {
            case "DONE":
            case "COMPLETED":
                return <CheckCircle2 className="w-6 h-6 text-green-500" />;
            case "PENDING":
            case "IN_PROGRESS":
                return <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />;
            case "FAILED":
                return <div className="w-6 h-6 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center font-bold">!</div>;
            default:
                return <Circle className="w-6 h-6 text-gray-300" />;
        }
    };

    return (
        <Card className="w-full mt-6">
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <span>Execution Status</span>
                    <span className="text-sm font-normal px-2 py-1 bg-gray-100 rounded-md uppercase text-xs">{status}</span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    {steps.map((step, index) => {
                        const stepExecution = step.execution;
                        const processList = stepExecution?.process || [];

                        return (
                            <div key={step.id} className="relative pl-8 pb-4 last:pb-0">
                                {/* Connecting Line */}
                                {index !== steps.length - 1 && (
                                    <div className="absolute left-[11px] top-8 bottom-0 w-0.5 bg-gray-200" />
                                )}

                                <div className="absolute left-0 top-0">
                                    {getStepStatusIcon(stepExecution?.status || 'NOT_STARTED')}
                                </div>

                                <div className="flex flex-col gap-1">
                                    <h4 className="font-semibold text-sm">
                                        Step {index + 1}: {step.toolDetails.name}
                                    </h4>
                                    <p className="text-xs text-gray-500">
                                        {step.action.fromToken.symbol} → {step.action.toToken.symbol}
                                    </p>

                                    {/* Transaction Hashes */}
                                    <div className="flex flex-col gap-1 mt-2">
                                        {processList.map((proc, i) => (
                                            proc.txHash && (
                                                <a
                                                    key={i}
                                                    href={proc.txLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-xs text-blue-500 hover:underline flex items-center gap-1"
                                                >
                                                    Tx: {proc.txHash.slice(0, 6)}...{proc.txHash.slice(-4)}
                                                    <ExternalLink className="w-3 h-3" />
                                                </a>
                                            )
                                        ))}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
