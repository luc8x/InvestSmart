'use client'

import { useState } from "react";
import { BancoFormDialog, BancoFormData } from "./BancoFormDialog";
import { toast } from "sonner";
import { updateBanco } from "@/utils/bancosServicos";

type Props = {
  banco: BancoFormData;
  open: boolean;
  setOpen: (val: boolean) => void;
  onUpdated: () => void;
};

export function BancoEditDialog({ banco, open, setOpen, onUpdated }: Props) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: BancoFormData) => {
    try {
      setLoading(true);
      const res = await updateBanco(banco.cnpj!, data);
      if (res?.id) {
        toast.success("Instituição atualizada com sucesso!");
        onUpdated();
        setOpen(false);
      } else {
        toast.error("Erro ao atualizar");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Erro ao atualizar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <BancoFormDialog
      title="Editar Instituição"
      description="Atualize os dados da instituição financeira."
      open={open}
      setOpen={setOpen}
      onSubmit={handleSubmit}
      bancos={[]} // não usamos busca de API aqui
      loading={loading}
      defaultValues={banco}
    />
  );
}
