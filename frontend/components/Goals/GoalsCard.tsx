"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "../ui/progress";

export function GoalsCard() {
    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle className="text-lg font-semibold">Meta: R$100.000</CardTitle>
                    <span className="text-sm text-muted-foreground">50%</span>
                </div>
            </CardHeader>
            <CardContent>
                <Progress color="#A855F7" value={45} className="h-3 rounded-full" />
                <div className="flex justify-between items-center mt-2 text-sm text-muted-foreground">
                    <span>R$ 45.000 alcançado</span>
                    <span>R$ 55.000 restante</span>
                </div>
            </CardContent>
        </Card>
    );
}
