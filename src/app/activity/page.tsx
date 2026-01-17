
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, ArrowUpRight, ArrowDownRight } from "lucide-react";

// Static mock data to avoid impure function calls during render
const MOCK_TRANSACTIONS = [
    { id: 1001, type: "bridge", amount: "+125.50", token: "USDC", date: "Jan 17, 2026", status: "completed" },
    { id: 1002, type: "deposit", amount: "+100.00", token: "USDC", date: "Jan 16, 2026", status: "completed" },
    { id: 1003, type: "bridge", amount: "+50.25", token: "USDC", date: "Jan 15, 2026", status: "completed" },
];

export default function ActivityPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Activity</h1>
                <p className="text-muted-foreground">View your recent transactions and alerts.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Transactions</CardTitle>
                    <CardDescription>History of your trades and transfers.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {MOCK_TRANSACTIONS.map((tx) => (
                            <div key={tx.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                        {tx.type === "bridge" ? (
                                            <ArrowUpRight className="w-5 h-5 text-green-600" />
                                        ) : (
                                            <ArrowDownRight className="w-5 h-5 text-blue-600" />
                                        )}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-medium capitalize">{tx.type} #{tx.id}</span>
                                        <span className="text-sm text-muted-foreground">{tx.date}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="font-medium text-green-600">{tx.amount} {tx.token}</span>
                                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

