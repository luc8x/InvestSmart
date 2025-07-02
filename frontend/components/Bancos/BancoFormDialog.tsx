'use client';

import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter, DialogClose
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader, Landmark } from "lucide-react";

import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

type BancoAPI = {
  nome: string;
  cnpj: string;
  tipo: string;
  pais: string;
  email: string;
  descricao: string;
  recurso: string;
  url_dados: string;
  url_consulta: string;
};

const schema = z.object({
  nome: z.string().min(1, "Campo obrigatório"),
  cnpj: z.string().optional(),
  tipo: z.string().min(1, "Campo obrigatório"),
  recurso: z.string().optional(),
  email: z.string().optional(),
  pais: z.string().default("Brasil"),
  url_dados: z.string().optional(),
  url_consulta: z.string().optional(),
  descricao: z.string().optional()
});

export type BancoFormData = z.infer<typeof schema>;

type Props = {
  title: string;
  description: string;
  open: boolean;
  setOpen: (val: boolean) => void;
  loading: boolean;
  onSubmit: (data: BancoFormData) => void;
  bancos?: BancoAPI[];
  defaultValues?: Partial<BancoFormData>;
};

export function BancoFormDialog({
  title, description, open, setOpen, loading, onSubmit,
  bancos = [], defaultValues = {}
}: Props) {
  const { register, handleSubmit, formState: { errors }, setValue, control } = useForm<BancoFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      pais: "Brasil",
      ...defaultValues
    }
  });

  const handleBancoSelecionado = (cnpj: string) => {
    const banco = bancos.find(b => b.cnpj === cnpj);
    if (!banco) return;

    setValue("nome", banco.nome);
    setValue("cnpj", banco.cnpj);
    setValue("email", banco.email);
    setValue("recurso", banco.recurso);
    setValue("url_consulta", banco.url_consulta);
    setValue("url_dados", banco.url_dados);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="banco-select">Buscar banco</Label>
            <Select onValueChange={handleBancoSelecionado}>
              <SelectTrigger id="banco-select">
                <SelectValue placeholder="Selecione uma instituição" />
              </SelectTrigger>
              <SelectContent>
                {bancos.map(banco => (
                  <SelectItem key={banco.cnpj} value={banco.cnpj}>
                    {banco.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="nome">Nome *</Label>
            <Input id="nome" {...register("nome")} />
            {errors.nome && <p className="text-sm text-red-500">{errors.nome.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="tipo">Tipo *</Label>
              <Controller
                name="tipo"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="tipo">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="conta_corrente">Conta Corrente</SelectItem>
                      <SelectItem value="conta_investimentos">Conta de Investimentos</SelectItem>
                      <SelectItem value="conta_poupanca">Conta Poupança</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div>
              <Label htmlFor="cnpj">CNPJ</Label>
              <Input id="cnpj" {...register("cnpj")} />
            </div>
          </div>

          <div>
            <Label htmlFor="pais">País</Label>
            <Input id="pais" {...register("pais")} />
          </div>

          <div>
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea id="descricao" {...register("descricao")} />
          </div>

          <DialogFooter className="sm:justify-between pt-4">
            <DialogClose asChild>
              <Button type="button" variant="secondary" disabled={loading}>Cancelar</Button>
            </DialogClose>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader size={16} className="animate-spin mr-2" />
                  Salvando...
                </>
              ) : (
                <>
                  <Landmark size={16} className="mr-2" />
                  Salvar Instituição
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
