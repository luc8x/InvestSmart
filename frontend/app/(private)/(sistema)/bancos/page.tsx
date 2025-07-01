"use client";

import {
  Card,
  CardHeader,
  CardContent,
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/index";
import { FormInstituicaoFinanceira } from '@/components/Bancos/Form'
import { Bancos, columns } from "@/components/Bancos/ListBancos/colunas"
import { DataTable } from "@/components/Bancos/ListBancos/data-table"
import Image from "next/image";
import { DollarSign, ChevronsUpDown, Landmark } from 'lucide-react';
import { listarBancos } from '@/utils/bancosServicos';

const contas = [
  {
    id: 1,
    nome: "Nubank",
    logo: "/img/Mastercard-logo.png",
    saldo: 4120.0,
    atualizado_em: "Hoje",
    cor_inicio: "from-purple-700",
    cor_fim: "to-purple-500",
  },
  {
    id: 2,
    nome: "Banco Inter",
    logo: "/img/Mastercard-logo.png",
    saldo: 1850.5,
    atualizado_em: "Ontem",
    cor_inicio: "from-orange-500",
    cor_fim: "to-yellow-400",
  },
  {
    id: 3,
    nome: "C6",
    logo: "/img/Mastercard-logo.png",
    saldo: 1850.5,
    atualizado_em: "Ontem",
    cor_inicio: "from-gray-800",
    cor_fim: "to-gray-400",
  },
  {
    id: 4,
    nome: "Santander",
    logo: "/img/Visa.png",
    saldo: 1850.5,
    atualizado_em: "Ontem",
    cor_inicio: "from-red-700",
    cor_fim: "to-red-300",
  },
];

async function getData(): Promise<Bancos[]> {
  const response = await listarBancos();
  console.log(response)
  if (!response.ok) {
    throw new Error('Erro ao buscar bancos');
  }

  const data = await response.json();
  return data as Bancos[];
}


export default function BancosPage() {
  const data = getData()
  return (
    <div className="flex flex-col gap-4">
      <div className="p-4 bg-white rounded-2xl border">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className={`bg-white text-black/90 rounded-2xl p-4 px-1 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.01]`}>
            <CardHeader className="flex items-center justify-between pb-5">
              <div className="font-semibold tracking-wide text-base text-black/60">
                Saldo Atual
              </div>
              <DollarSign />
            </CardHeader>

            <CardContent className="space-y-2">
              <div className="text-3xl font-bold tracking-tight mb-3">
                R$ 12.300,00
              </div>
              <p className="text-sm text-black/80 flex items-center gap-1 m-0">
                <ChevronsUpDown size={14} />
                Atualizado Hoje
              </p>
            </CardContent>
          </Card>
          <Carousel className="col-span-3">
            <CarouselContent className="px-6 py-2">
              {contas.map((conta) => (
                <CarouselItem className="basis-1/3">
                  <Card
                    key={conta.id}
                    className={`bg-gradient-to-br ${conta.cor_inicio} ${conta.cor_fim} text-white rounded-2xl p-4 px-1 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.03]`}
                  >
                    <CardHeader className="flex items-center justify-between pb-3">
                      <div className="text-base font-semibold tracking-wide">
                        {conta.nome}
                      </div>
                      <Image
                        src={conta.logo}
                        width={40}
                        height={40}
                        alt={`${conta.nome} logo`}
                        className="bg-white rounded-md p-1 shadow-md"
                        unoptimized
                      />
                    </CardHeader>

                    <CardContent className="space-y-2">
                      <div className="text-3xl font-bold tracking-tight">
                        R$ {conta.saldo.toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                        })}
                      </div>
                      <p className="text-sm text-white/80 flex items-center gap-1">
                        <ChevronsUpDown size={14} />
                        Atualizado {conta.atualizado_em}
                      </p>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
      <div className="p-4 bg-white rounded-2xl border">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
          <Card className={`bg-white text-black/90 rounded-2xl p-4 px-1 shadow-sm`}>
            <CardHeader className="flex items-center justify-between pb-5">
              <div className="font-semibold tracking-wide text-base text-black/60">
                Bancos
              </div>
              <Landmark />
            </CardHeader>

            <CardContent className="space-y-2">
              <DataTable columns={columns} data={data} />
            </CardContent>
          </Card>
          <div>
            <div className="flex items-center p-4 justify-between font-semibold tracking-wide text-base border bg-white text-black/90 rounded-2xl shadow-sm">
              Instituição Financeira
                <FormInstituicaoFinanceira/>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}