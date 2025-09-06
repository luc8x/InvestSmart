import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
export function InfoValue({ title, value, icon, iconComparison, titleColor, description, delay }: { title: string, value: string, icon: React.ReactNode, iconComparison?: React.ReactNode, titleColor?: string, description?: string, delay?: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, delay: delay, ease: "easeOut" }}
            className="transform-gpu"
        >
            <Card className="flex flex-col justify-between h-full hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className={`text-base font-medium text-muted-foreground`}>
                        {title}
                    </CardTitle>
                    <motion.div
                        initial={{ x: -10, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.5, ease: "easeOut" }}
                    >
                        {icon}
                    </motion.div>
                </CardHeader>

                <CardContent className="mt-auto">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="text-4xl font-bold text-foreground flex gap-2 items-center"
                        >
                        <span className={titleColor}>{value}</span>
                        <motion.div
                            animate={{ y: [0, -8, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                            >
                            {iconComparison}
                        </motion.div>
                    </motion.div>
                    <p className="text-xs text-muted-foreground mt-1">{description}</p>
                </CardContent>
            </Card>
        </motion.div>
    )
}