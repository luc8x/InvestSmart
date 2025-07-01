'use client'

import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Dialog, DialogTrigger, DialogContent, DialogHeader,
    DialogTitle, DialogDescription, DialogFooter, DialogClose
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Landmark, Loader } from "lucide-react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cadastrarBanco } from "@/utils/bancosServicos";

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

type FormData = z.infer<typeof schema>;
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

export function FormInstituicaoFinanceira() {
    const { register, handleSubmit, formState: { errors }, reset, setValue, control } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: { pais: "Brasil" }
    });

    const [bancos, setBancos] = useState<BancoAPI[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetch("https://olinda.bcb.gov.br/olinda/servico/DASFN/versao/v1/odata/Recursos?$top=10000&$format=json&$select=CnpjInstituicao,NomeInstituicao,EmailContato,Recurso,URLDados,URLConsulta")
            .then(res => res.json())
            .then(data => {
                // Agrupar por CNPJ para evitar duplicações
                const mapa = new Map();
                data.value.forEach(item => {
                    const key = item.CnpjInstituicao;
                    if (!mapa.has(key)) {
                        mapa.set(key, {
                            nome: item.NomeInstituicao,
                            cnpj: item.CnpjInstituicao,
                            email: item.EmailContato,
                            recurso: item.Recurso,
                            url_dados: item.URLDados,
                            url_consulta: item.URLConsulta,
                        });
                    }
                });

                const bancosUnicos = Array.from(mapa.values());
                setBancos(bancosUnicos);
            })
            .catch(() => toast.error("Erro ao buscar instituições do Bacen"));
    }, []);

    const handleBancoSelecionado = (cnpj: string) => {
        const banco = bancos.find(b => b.cnpj === cnpj);
        if (banco) {
            setValue("nome", banco.nome);
            setValue("cnpj", banco.cnpj);
            setValue("email", banco.email);
            setValue("recurso", banco.recurso);
            setValue("url_consulta", banco.url_consulta);
            setValue("url_dados", banco.url_dados);
        }
    };

    const onSubmit = async (data: FormData) => {
        try {
            setLoading(true);
            let res = data;
            console.log(res)
            res = await cadastrarBanco(data);
            if (res?.id) {
                toast.success("Instituição cadastrada com sucesso!");
                reset();
            } else {
                toast.error("Erro ao cadastrar");
            }
        } catch (err: any) {
            const msg = err?.response?.data?.message || "Erro ao cadastrar";
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <Plus className="mr-2 h-4 w-4" />
                    Nova Instituição
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>Cadastrar Instituição Financeira</DialogTitle>
                    <DialogDescription>
                        Selecione uma instituição ou preencha manualmente.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <Label className="mb-2" htmlFor="banco-select">Buscar banco</Label>
                        <Select onValueChange={handleBancoSelecionado}>
                            <SelectTrigger className="w-full" id="banco-select">
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
                        <Label className="mb-2" htmlFor="nome">Nome da Instituição: *</Label>
                        <Input id="nome" {...register("nome")} placeholder="Ex: Banco do Brasil" />
                        {errors.nome && <p className="text-sm text-red-500">{errors.nome.message}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label className="mb-2" htmlFor="tipo">Tipo: *</Label>
                            <Controller
                                name="tipo"
                                control={control}
                                render={({ field }) => (
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <SelectTrigger className="w-full" id="tipo">
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
                            <Label className="mb-2" htmlFor="cnpj">CNPJ</Label>
                            <Input id="cnpj" {...register("cnpj")} placeholder="Ex: 00.000.000/0001-00" />
                            {errors.cnpj && <p className="text-sm text-red-500">{errors.cnpj.message}</p>}
                        </div>
                    </div>

                    <div>
                        <Label className="mb-2" htmlFor="pais">País:</Label>
                        <Input id="pais" className="w-full" {...register("pais")} />
                    </div>

                    <div>
                        <Label className="mb-2" htmlFor="descricao">Descrição:</Label>
                        <Textarea id="descricao" {...register("descricao")} placeholder="Informações adicionais..." />
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
