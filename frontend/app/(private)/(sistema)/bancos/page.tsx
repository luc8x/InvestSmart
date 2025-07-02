"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Carousel,
  CarouselContent,
  CarouselItem,
  Button,
} from "@/components/ui/index";
import { BancoCreateDialog } from '@/components/Bancos/BancoCreateDialog'
import { Banco, UsuarioBanco, columns } from "@/components/Bancos/ListBancos/colunas"
import { DataTable } from "@/components/Bancos/ListBancos/data-table"
import Image from "next/image";
import { DollarSign, ChevronsUpDown, Landmark } from 'lucide-react';
import { listarBancos } from '@/utils/bancosServicos';
import { Pie, PieChart } from "recharts";

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

async function getData(): Promise<Banco[]> {
  const response = await listarBancos();

  if (!response) {
    throw new Error('Erro ao buscar bancos');
  }

  const data = response as UsuarioBanco[];

  return data.map((item) => ({
    ...item.banco,
    tipo: item.banco.tipo.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    cnpj: item.banco.cnpj.replace(/\D/g, '').replace(/^(\d{2})(\d)/, '$1.$2').replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3').replace(/\.(\d{3})(\d)/, '.$1/$2').replace(/(\d{4})(\d)/, '$1-$2')
  }));
}

export default function BancosPage() {
  const [data, setData] = useState<Banco[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    getData().then(setData).catch(console.error);
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div className="p-4 bg-white rounded-2xl border">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className={`bg-white text-black/90 rounded-2xl p-4 px-1 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.01]`}>
            <CardHeader className="flex items-center justify-between pb-5">
              <div className="font-semibold tracking-wide text-base text-black/60">
                Saldo Total
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
                <CarouselItem key={conta.id} className="basis-1/3">
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
            <CardHeader className="flex items-center justify-between pb-1">
              <div className="font-semibold tracking-wide text-base text-black/60">
                Instituição Financeira
              </div>
              <BancoCreateDialog onCreated={() => {
                getData().then(setData);
              }} />
            </CardHeader>

            <CardContent className="space-y-2">
              <DataTable columns={columns} data={data} />
            </CardContent>
          </Card>
          <div className="flex gap-3">
            <Card className={`bg-white text-black/90 rounded-2xl p-4 px-1 shadow-sm`}>
              <CardContent className="space-y-2">
                <div className="font-semibold text-black/60">Indicadores</div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="p-3 bg-gray-300 rounded-2xl border-1 border-gray-500 flex flex-col justify-between">
                    <p className="text-muted-foreground">Instituições Cadastradas</p>
                    <p className="text-xl font-bold">{data.length}</p>
                  </div>
                  <div className="p-3 bg-accent-foreground rounded-2xl border-1 border-gray-500 flex flex-col justify-between">
                    <p className="text-muted-foreground">Contas Correntes</p>
                    <p className="text-xl font-bold">{data.filter(b => b.tipo === 'Conta Corrente').length}</p>
                  </div>
                  <div className="p-3 bg-accent-foreground rounded-2xl border-1 border-gray-500 flex flex-col justify-between">
                    <p className="text-muted-foreground">Contas Poupança</p>
                    <p className="text-xl font-bold">{data.filter(b => b.tipo === 'Conta Poupanca').length}</p>
                  </div>
                  <div className="p-3 bg-accent-foreground rounded-2xl border-1 border-gray-500 flex flex-col justify-between">
                    <p className="text-muted-foreground">Contas de Investimento</p>
                    <p className="text-xl font-bold">{data.filter(b => b.tipo === 'Conta Investimentos').length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <div className="flex flex-col gap-3">
              <Card className={`bg-white text-black/90 rounded-2xl p-4 px-1 shadow-sm`}>
                <CardContent className="space-y-2">
                  <div className="font-semibold text-black/60">Dicas rápidas</div>
                  <ul className="text-sm list-disc pl-4">
                    <li>Use a busca automática para preencher dados do Bacen.</li>
                    <li>Cada instituição será vinculada à sua conta.</li>
                    <li>Você pode cadastrar múltiplas contas por banco.</li>
                  </ul>
                </CardContent>
              </Card>
              <Card className="bg-white text-black/90 rounded-2xl p-4 px-1 shadow-sm">
                <CardContent className="space-y-2">
                  <div className="font-semibold text-black/60 mb-2">Ações rápidas</div>
                  <div className="flex flex-col gap-2">
                    <Button variant="secondary" size="sm">Exportar CSV</Button>
                    <Button variant="secondary" size="sm">Importar Planilha</Button>
                    <Button variant="secondary" size="sm">Gerar Relatório</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}