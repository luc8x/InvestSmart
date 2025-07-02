'use client'

import { useEffect, useState } from "react";
import { BancoFormDialog, BancoFormData } from "./BancoFormDialog";
import { cadastrarBanco } from "@/utils/bancosServicos";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function BancoCreateDialog({ onCreated }: { onCreated: () => void }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bancos, setBancos] = useState([]);

  useEffect(() => {
    fetch("https://olinda.bcb.gov.br/olinda/servico/DASFN/versao/v1/odata/Recursos?$top=10000&$format=json&$select=CnpjInstituicao,NomeInstituicao,EmailContato,Recurso,URLDados,URLConsulta")
      .then(res => res.json())
      .then(data => {
        const mapa = new Map();
        data.value.forEach(item => {
          if (!mapa.has(item.CnpjInstituicao)) {
            mapa.set(item.CnpjInstituicao, {
              nome: item.NomeInstituicao,
              cnpj: item.CnpjInstituicao,
              email: item.EmailContato,
              recurso: item.Recurso,
              url_dados: item.URLDados,
              url_consulta: item.URLConsulta,
            });
          }
        });
        setBancos(Array.from(mapa.values()));
      })
      .catch(() => toast.error("Erro ao buscar instituições"));
  }, []);

  const handleSubmit = async (data: BancoFormData) => {
    try {
      setLoading(true);
      const res = await cadastrarBanco(data);
      if (res?.id) {
        toast.success("Instituição cadastrada com sucesso!");
        onCreated();
        setOpen(false);
      } else {
        toast.error("Erro ao cadastrar");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Erro ao cadastrar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        <Plus className="mr-2 h-4 w-4" />
        Nova Instituição
      </Button>

      <BancoFormDialog
        title="Cadastrar Instituição Financeira"
        description="Selecione uma instituição ou preencha manualmente."
        open={open}
        setOpen={setOpen}
        onSubmit={handleSubmit}
        bancos={bancos}
        loading={loading}
      />
    </>
  );
}
