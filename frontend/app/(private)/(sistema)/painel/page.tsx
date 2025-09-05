"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { ArrowUp, BarChart, CreditCard, DollarSign, Search, TrendingUp } from "lucide-react"
import { LineChart } from "@/components/lineChart"
import { RecentTransactions } from "@/components/recenteTransacoes"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import Top10Acoes from "@/components/Top10Acoes"

export default function PainelPage() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
        <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            className="transform-gpu"
          >
            <Card className="flex flex-col justify-between h-full hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-medium text-muted-foreground">
                  Saldo Atual
                </CardTitle>
                <motion.div
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.5, ease: "easeOut" }}
                >
                  <DollarSign size={24} className="text-gray-400" />
                </motion.div>
              </CardHeader>

              <CardContent className="mt-auto">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="text-4xl font-bold text-foreground"
                >
                  R$ 12.300,00
                </motion.div>
                <p className="text-xs text-muted-foreground mt-1">Atualizado hoje</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
            className="transform-gpu"
          >
            <Card className="flex flex-col justify-between h-full hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-medium text-muted-foreground">
                  Receitas
                </CardTitle>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.4, type: "spring", stiffness: 200 }}
                >
                  <TrendingUp size={24} className="text-gray-400" />
                </motion.div>
              </CardHeader>

              <CardContent className="mt-auto">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="text-4xl font-bold text-green-600"
                >
                  R$ 4.500,00
                </motion.div>
                <p className="text-xs text-muted-foreground mt-1">Este mês</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
            className="transform-gpu"
          >
            <Card className="flex flex-col justify-between h-full hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-medium text-muted-foreground">
                  Despesas
                </CardTitle>
                <motion.div
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.5, ease: "easeOut" }}
                >
                  <CreditCard size={24} className="text-gray-400" />
                </motion.div>
              </CardHeader>

              <CardContent className="mt-auto">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="text-4xl font-bold text-red-500"
                >
                  R$ 3.200,00
                </motion.div>
                <p className="text-xs text-muted-foreground mt-1">Este mês</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
            className="transform-gpu"
          >
            <Card className="flex flex-col justify-between h-full hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-medium text-muted-foreground">
                  Lucro
                </CardTitle>
                <motion.div
                  initial={{ rotate: -180, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  transition={{ duration: 0.7, delay: 0.6, ease: "easeOut" }}
                >
                  <BarChart size={24} className="text-gray-400" />
                </motion.div>
              </CardHeader>

              <CardContent className="mt-auto">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                  className="text-4xl font-bold text-green-600 flex gap-2 items-center"
                >
                  R$ 1.300,00
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <ArrowUp className="text-green-600" />
                  </motion.div>
                </motion.div>
                <p className="text-xs text-muted-foreground mt-1">
                  Comparado ao mês anterior
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Fluxo de Caixa</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <LineChart />
          </CardContent>
        </Card>
      </div>


      {/* <Separator className="my-4" /> */}

    <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
      <Card className="gap-2">
        <CardHeader>
          <div className="flex flex-row items-center justify-between mb-0">
            <CardTitle>Transações Recentes</CardTitle>
            <div className="relative group">
              <Input
                type="text"
                placeholder="Procurar..."
                className="pr-9 w-48 focus:w-56 border border-gray-200 backdrop-blur-sm rounded-full text-white placeholder:text-gray-900/60 focus:shadow-none focus:border-white/40 transition-all duration-300"
              />
              <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 group-hover:text-white/80 transition-colors duration-200" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <hr className=" mb-4 border-gray-200" />
          <RecentTransactions />
        </CardContent>
      </Card>
      <Card className="gap-2">
        <CardHeader>
            <CardTitle>Investimentos</CardTitle>
        </CardHeader>
        <CardContent>
          <hr className=" mb-4 border-gray-200" />
          <Top10Acoes />
        </CardContent>
      </Card>
    </div>
    </div>
  )
}
