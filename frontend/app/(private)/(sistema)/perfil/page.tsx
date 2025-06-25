"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import {
    Camera,
    UserRoundPen,
    Lock,
    BadgeInfo
} from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "sonner";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { getUserFromCookies, updateUserInfo } from '@/utils/usersServices';
import { mask, unMask } from 'remask';

const estados = [
    { uf: "AC", nome: "Acre" },
    { uf: "AL", nome: "Alagoas" },
    { uf: "AP", nome: "Amapá" },
    { uf: "AM", nome: "Amazonas" },
    { uf: "BA", nome: "Bahia" },
    { uf: "CE", nome: "Ceará" },
    { uf: "DF", nome: "Distrito Federal" },
    { uf: "ES", nome: "Espírito Santo" },
    { uf: "GO", nome: "Goiás" },
    { uf: "MA", nome: "Maranhão" },
    { uf: "MT", nome: "Mato Grosso" },
    { uf: "MS", nome: "Mato Grosso do Sul" },
    { uf: "MG", nome: "Minas Gerais" },
    { uf: "PA", nome: "Pará" },
    { uf: "PB", nome: "Paraíba" },
    { uf: "PR", nome: "Paraná" },
    { uf: "PE", nome: "Pernambuco" },
    { uf: "PI", nome: "Piauí" },
    { uf: "RJ", nome: "Rio de Janeiro" },
    { uf: "RN", nome: "Rio Grande do Norte" },
    { uf: "RS", nome: "Rio Grande do Sul" },
    { uf: "RO", nome: "Rondônia" },
    { uf: "RR", nome: "Roraima" },
    { uf: "SC", nome: "Santa Catarina" },
    { uf: "SP", nome: "São Paulo" },
    { uf: "SE", nome: "Sergipe" },
    { uf: "TO", nome: "Tocantins" }
];

interface User {
    id: number;
    nomeCompleto: string;
    email: string;
    cpf: string;
    foto: string | null;
    fotoFile: File | null;
    telefone: string;
    genero: string;
    logradouro: string;
    numero: string;
    complemento: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
    dataNascimento: Date | undefined;
}

export const parseDate = (date: string | null | undefined): Date | null => {
    if (!date) return null;
    const d = new Date(date);
    return isNaN(d.getTime()) ? null : d;
};

export default function PerfilPage() {

    const [formData, setFormData] = useState<User>({
        nomeCompleto: '',
        email: '',
        cpf: '',
        foto: null as string | null,
        fotoFile: null as File | null,
        telefone: '',
        genero: undefined as string | undefined,
        logradouro: '',
        numero: '',
        complemento: '',
        bairro: '',
        cidade: '',
        estado: '',
        cep: '',
        dataNascimento: undefined as Date | undefined,
    });

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const { user: userData, perfil: perfilData } = getUserFromCookies();
        let foto = localStorage.getItem('user_foto');
        if (userData) {
            try {
                console.log(userData?.cpf)
                setFormData({
                    nomeCompleto: userData?.user.nome_completo,
                    email: userData?.user.email,
                    cpf: mask((userData?.user.cpf), ['999.999.999-99']),
                    dataNascimento: userData?.user.data_nascimento ? parseDate(userData?.user.data_nascimento) : undefined,
                    foto: foto || null,
                    fotoFile: null,
                    telefone: mask((perfilData?.telefone || ''), ['(99) 99999-9999']),
                    genero: perfilData?.genero || '',
                    logradouro: perfilData?.logradouro || '',
                    numero: perfilData?.numero || '',
                    complemento: perfilData?.complemento || '',
                    bairro: perfilData?.bairro || '',
                    cidade: perfilData?.cidade || '',
                    estado: perfilData?.estado || '',
                    cep: mask((perfilData?.cep || ''), ['99999-999']),
                });
            } catch (error) {
                console.error('Erro ao carregar dados do usuário:', error);
                toast.error('Erro ao carregar dados do usuário.');
            }
        }

        setIsLoading(false);
    }, []);

    useEffect(() => {
        return () => {
            if (formData.foto) {
                URL.revokeObjectURL(formData.foto);
            }
        };
    }, [formData.foto]);


    const handleChange = (field: string, value: any) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const previewUrl = URL.createObjectURL(file);
        handleChange('fotoFile', file);
        handleChange('foto', previewUrl);
    };


    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
        });
    };

    const fetchAddressByCEP = async (cep: string) => {
        const cleanCEP = cep.replace(/\D/g, '');
        if (cleanCEP.length !== 8) return null;

        try {
            const response = await fetch(`https://viacep.com.br/ws/${cleanCEP}/json/`);
            const data = await response.json();

            if (data.erro) {
                toast.error(`Nenhum endereço encontrado com o CEP informado.`);
                return null;
            }

            return {
                logradouro: data.logradouro,
                bairro: data.bairro,
                cidade: data.localidade,
                estado: data.uf,
            };
        } catch (error) {
            toast.error(`Erro ao buscar CEP: ${error}`);
            return null;
        }
    };

    const handleCepChange = async (value: string) => {
        const maskedCep = mask(unMask(value), ['99999-999']);
        handleChange('cep', maskedCep);

        if (unMask(value).length === 8) {

            handleChange('logradouro', 'Carregando...');
            handleChange('bairro', 'Carregando...');
            handleChange('cidade', 'Carregando...');
            handleChange('estado', 'Carregando...');

            const address = await fetchAddressByCEP(maskedCep);

            handleChange('logradouro', address?.logradouro || '');
            handleChange('bairro', address?.bairro || '');
            handleChange('cidade', address?.cidade || '');
            handleChange('estado', address?.estado || '');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        let fotoBase64 = null;
        if (formData.fotoFile) {
            fotoBase64 = await fileToBase64(formData.fotoFile);
        }

        const submitData = new FormData();
        submitData.append('nome_completo', formData.nomeCompleto);
        submitData.append('email', formData.email);
        submitData.append('cpf', formData.cpf);
        submitData.append('data_nascimento', formData.dataNascimento ? formData.dataNascimento.toISOString().split('T')[0] : '');
        submitData.append('telefone', formData.telefone);
        submitData.append('genero', formData.genero);
        submitData.append('logradouro', formData.logradouro);
        submitData.append('numero', unMask(formData.numero));
        submitData.append('complemento', formData.complemento);
        submitData.append('bairro', formData.bairro);
        submitData.append('cidade', formData.cidade);
        submitData.append('estado', formData.estado);
        submitData.append('cep', unMask(formData.cep));
        if (fotoBase64) {
            submitData.append('foto', fotoBase64);
        }

        try {
            await updateUserInfo(submitData);
            toast.success('Perfil atualizado com sucesso!');
        } catch (error:any) {
            console.log(error)
           toast.error('Não foi possivel atualizar o perfil.', {
                description: (
                    <span className="text-sm text-red-700">
                        Corrija os campos obrigatórios e tente novamente.
                    </span>
                )
            });
        }
    };

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <div className="grid auto-rows-min gap-4 md:grid-cols-1">
                <Card className="text-white shadow-lg" style={{ background: '#222' }}>
                    <CardHeader className="flex flex-row items-start justify-between">
                        <div>
                            <CardTitle className="text-lg">Olá, {formData.nomeCompleto ? formData.nomeCompleto : 'Usuário'}</CardTitle>
                            <CardDescription>Sempre mantenha suas informações atualizadas!</CardDescription>
                        </div>
                    </CardHeader>
                    <hr />
                    <CardContent className="flex flex-col gap-8">
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight">
                                Dados do Usuário
                            </h2>
                            <p className="text-muted-foreground text-sm">
                                Gerencie suas informações pessoais e endereço
                            </p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="flex flex-col items-center gap-4">
                                <img
                                    src={formData.foto || "/img/avatar-placeholder.png"}
                                    alt="Foto de perfil"
                                    className="rounded-xl w-100 h-100 object-cover border"
                                />

                                <label htmlFor="foto-upload" className="cursor-pointer">
                                    <Button variant="secondary" asChild disabled={isLoading}>
                                        <span><Camera /> Alterar Foto</span>
                                    </Button>
                                </label>

                                <input
                                    id="foto-upload"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleFileChange}
                                />
                            </div>

                            <form className="flex flex-col gap-6 lg:col-span-2" onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="nome_completo">Nome Completo: </Label>
                                        {isLoading ? (
                                            <Skeleton className="h-9 w-full rounded-md bg-transparent border-1 border-white" placeholder="Carregando" />
                                        ) : (
                                            <div className="relative">
                                                <Input
                                                    id="nome_completo"
                                                    placeholder="Digite seu nome"
                                                    disabled
                                                    value={formData.nomeCompleto}
                                                    className="pr-10"
                                                />
                                                <Lock size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="email">Email:
                                            <Tooltip>
                                                <TooltipTrigger className="text-red-400">*</TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Campo Obrigatório</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </Label>
                                        {isLoading ? (
                                            <Skeleton className="h-9 w-full rounded-md bg-transparent border-1 border-white" placeholder="Carregando" />
                                        ) : (
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="Digite seu email"
                                                disabled={isLoading}
                                                value={formData.email}
                                                onChange={(e) => handleChange('email', e.target.value)}
                                            />
                                        )}
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="cpf">CPF: </Label>
                                        {isLoading ? (
                                            <Skeleton className="h-9 w-full rounded-md bg-transparent border-1 border-white" placeholder="Carregando" />
                                        ) : (
                                            <div className="relative">
                                                <Input
                                                    id="cpf"
                                                    placeholder="Digite seu CPF"
                                                    disabled
                                                    value={formData.cpf}
                                                    className="pr-10"
                                                />
                                                <Lock size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="data_nascimento">Data de Nascimento:
                                            <Tooltip>
                                                <TooltipTrigger className="text-red-400">*</TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Campo Obrigatório</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </Label>
                                        {isLoading ? (
                                            <Skeleton className="h-9 w-full rounded-md bg-transparent border-1 border-white" placeholder="Carregando" />
                                        ) : (
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        id="data_nascimento"
                                                        variant="dark"
                                                        disabled={isLoading}
                                                        className={cn(
                                                            "justify-start text-left font-normal",
                                                            !formData.dataNascimento && "text-muted-foreground"
                                                        )}
                                                    >
                                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                                        {formData.dataNascimento
                                                            ? format(formData.dataNascimento, 'dd/MM/yyyy')
                                                            : 'Selecione uma data'}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar
                                                        mode="single"
                                                        buttonVariant={"secondary"}
                                                        selected={formData.dataNascimento}
                                                        onSelect={(e) => handleChange('dataNascimento', e)}
                                                        captionLayout="dropdown"
                                                        fromYear={1960}
                                                        toYear={new Date().getFullYear()}
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        )}
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="telefone">Telefone:
                                            <Tooltip>
                                                <TooltipTrigger className="text-red-400">*</TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Campo Obrigatório</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </Label>
                                        {isLoading ? (
                                            <Skeleton className="h-9 w-full rounded-md bg-transparent border-1 border-white" placeholder="Carregando" />
                                        ) : (
                                            <Input
                                                id="telefone"
                                                placeholder="(XX) XXXXX-XXXX"
                                                disabled={isLoading}
                                                value={formData.telefone}
                                                onChange={(e) => handleChange('telefone', mask(e.target.value, ['(99) 99999-9999']))}
                                            />
                                        )}
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="genero">Gênero:
                                            <Tooltip>
                                                <TooltipTrigger className="text-red-400">*</TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Campo Obrigatório</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </Label>
                                        {isLoading ? (
                                            <Skeleton className="h-9 w-full rounded-md bg-transparent border-1 border-white" placeholder="Carregando" />
                                        ) : (
                                            <Select
                                                value={formData.genero}
                                                onValueChange={(e) => handleChange('genero', e || formData.genero)}
                                                disabled={isLoading}
                                            >
                                                <SelectTrigger className="w-full" id="genero">
                                                    <SelectValue placeholder="Selecione seu gênero" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="M">Masculino</SelectItem>
                                                    <SelectItem value="F">Feminino</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        )}
                                    </div>
                                </div>

                                <Separator />

                                <h3 className="text-xl font-semibold items-center flex gap-2">
                                    Endereço
                                    <Tooltip>
                                        <TooltipTrigger className="text-secondary"><BadgeInfo size={15} /></TooltipTrigger>
                                        <TooltipContent>
                                            <p>Campos Opcionais</p>
                                        </TooltipContent>
                                    </Tooltip>

                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="cep">CEP:</Label>
                                        {isLoading ? (
                                            <Skeleton className="h-9 w-full rounded-md bg-transparent border-1 border-white" placeholder="Carregando" />
                                        ) : (
                                            <div className="flex flex-col gap-1">
                                                <Input
                                                    id="cep"
                                                    placeholder="Digite seu CEP"
                                                    value={formData.cep}
                                                    onChange={(e) => handleCepChange(e.target.value)}
                                                />
                                                <a
                                                    href="https://www.buscacep.correios.com.br/"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-sm text-gray-500 hover:underline"
                                                >
                                                    Não sabe seu CEP?
                                                </a>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="logradouro">Logradouro:</Label>
                                        {isLoading ? (
                                            <Skeleton className="h-9 w-full rounded-md bg-transparent border-1 border-white" placeholder="Carregando" />
                                        ) : (
                                            <Input
                                                id="logradouro"
                                                placeholder="Rua, Avenida, etc"
                                                disabled={isLoading}
                                                value={formData.logradouro}
                                                onChange={(e) => handleChange('logradouro', e.target.value)}
                                            />
                                        )}
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="numero">Número:</Label>
                                        {isLoading ? (
                                            <Skeleton className="h-9 w-full rounded-md bg-transparent border-1 border-white" placeholder="Carregando" />
                                        ) : (
                                            <Input
                                                id="numero"
                                                placeholder="Número"
                                                disabled={isLoading}
                                                // maxLength={10}
                                                value={formData.numero}
                                                onChange={(e) => handleChange('numero', e.target.value.toUpperCase())}
                                            />
                                        )}
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="complemento">Complemento:</Label>
                                        {isLoading ? (
                                            <Skeleton className="h-9 w-full rounded-md bg-transparent border-1 border-white" placeholder="Carregando" />
                                        ) : (
                                            <Input
                                                id="complemento"
                                                placeholder="Apartamento, bloco, etc"
                                                disabled={isLoading}
                                                value={formData.complemento}
                                                onChange={(e) => handleChange('complemento', e.target.value)}
                                            />
                                        )}
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="bairro">Bairro:</Label>
                                        {isLoading ? (
                                            <Skeleton className="h-9 w-full rounded-md bg-transparent border-1 border-white" placeholder="Carregando" />
                                        ) : (
                                            <Input
                                                id="bairro"
                                                placeholder="Digite o bairro"
                                                disabled={isLoading}
                                                value={formData.bairro}
                                                onChange={(e) => handleChange('bairro', e.target.value)}
                                            />
                                        )}
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="cidade">Cidade:</Label>
                                        {isLoading ? (
                                            <Skeleton className="h-9 w-full rounded-md bg-transparent border-1 border-white" placeholder="Carregando" />
                                        ) : (
                                            <Input
                                                id="cidade"
                                                placeholder="Digite a cidade"
                                                disabled={isLoading}
                                                value={formData.cidade}
                                                onChange={(e) => handleChange('cidade', e.target.value)}
                                            />
                                        )}
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="estado">Estado:</Label>
                                        {isLoading ? (
                                            <Skeleton className="h-9 w-full rounded-md bg-transparent border-1 border-white" placeholder="Carregando" />
                                        ) : (
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="dark"
                                                        role="combobox"
                                                        className="w-full justify-between"
                                                    >
                                                        {formData.estado
                                                            ? estados.find((e) => e.uf === formData.estado)?.nome
                                                            : "Selecione o Estado"}
                                                    </Button>
                                                </PopoverTrigger>

                                                <PopoverContent className="w-[200px] p-0">
                                                    <Command>
                                                        <CommandInput placeholder="Procurar Estado..." className="h-9" />
                                                        <CommandList>
                                                            <CommandEmpty>Nenhum estado encontrado.</CommandEmpty>
                                                            <CommandGroup>
                                                                {estados.map((estado) => (
                                                                    <CommandItem
                                                                        key={estado.uf}
                                                                        value={estado.uf}
                                                                        onSelect={() => handleChange('estado', estado.uf)}
                                                                    >
                                                                        {estado.nome}
                                                                    </CommandItem>
                                                                ))}
                                                            </CommandGroup>
                                                        </CommandList>
                                                    </Command>
                                                </PopoverContent>
                                            </Popover>
                                        )}
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <Button type="submit" variant={"dark"} disabled={isLoading}>
                                        <UserRoundPen /> Salvar Alterações
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}