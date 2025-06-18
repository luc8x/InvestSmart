"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Camera, UserRoundPen  } from 'lucide-react';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label"

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "sonner"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { getUserFromCookies, updateUserInfo, uploadFoto } from '@/utils/usersServices';

export default function PerfilPage() {

    const [user, setUser] = useState(null);

    useEffect(() => {
        const userData: any = getUserFromCookies();
        if (userData) {
            setUser(userData);
        }
    }, []);

    const [nomeCompleto, setNomeCompleto] = useState('');
    const [email, setEmail] = useState('');
    const [cpf, setCpf] = useState('');
    const [foto, setFoto] = useState<string | null>(null);
    const [fotoFile, setFotoFile] = useState<File | null>(null);

    const [telefone, setTelefone] = useState('');
    const [genero, setGenero] = useState('');
    const [logradouro, setLogradouro] = useState('');
    const [numero, setNumero] = useState('');
    const [complemento, setComplemento] = useState('');
    const [bairro, setBairro] = useState('');
    const [cidade, setCidade] = useState('');
    const [estado, setEstado] = useState('');
    const [cep, setCep] = useState('');
    const [dataNascimento, setDataNascimento] = useState<Date | undefined>();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        setFotoFile(file);
        const previewUrl = URL.createObjectURL(file);
        setFoto(previewUrl);
    }
    };

    useEffect(() => {
        if (!user) return;

        setNomeCompleto(user.nome_completo || null);
        setEmail(user.email || null);
        setCpf(user.cpf || null);
        setFoto(user.perfil?.foto || null);
        setTelefone(user.perfil?.telefone || null);
        setGenero(user.perfil?.genero || null);
        setLogradouro(user.perfil?.logradouro || null);
        setNumero(user.perfil?.numero || null);
        setComplemento(user.perfil?.complemento || null);
        setBairro(user.perfil?.bairro || null);
        setCidade(user.perfil?.cidade || null);
        setEstado(user.perfil?.estado || null);
        setCep(user.perfil?.cep || null);
        setDataNascimento(user.data_nascimento ? new Date(user.data_nascimento) : null);
    }, [user]);
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        let fotoUrl = '';

        if (fotoFile) {
            fotoUrl = await uploadFoto(foto);
        }

        const payload = {
            nome_completo,
            email,
            cpf,
            data_nascimento: dataNascimento?.toISOString().split('T')[0] || null,
            perfil: {
            telefone,
            genero,
            logradouro,
            numero,
            complemento,
            bairro,
            cidade,
            estado,
            cep,
            foto: fotoUrl || foto, 
            },
        };

        try {
            const updatedUser = await updateUserInfo(payload);
            setUser(updatedUser);
            toast.success('Perfil atualizado com sucesso!');
        } catch {
            toast.error('Erro ao atualizar perfil.');
        }
    };

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <div className="grid auto-rows-min gap-4 md:grid-cols-1">
                <Card className="text-white shadow-lg" style={{ background: '#222' }}>
                    <CardHeader className="flex flex-row items-start justify-between">
                        <div>
                            <CardTitle className="text-lg">Olá, {user ? user.nome_completo : 'Usuário'}</CardTitle>
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
                            {/* Foto */}
                            <div className="flex flex-col items-center gap-4">
                                <img
                                    src={foto || "/img/avatar-placeholder.png"}
                                    alt="Foto de perfil"
                                    className="rounded-xl w-24 h-24 object-cover border"
                                />
                                
                                <label htmlFor="foto-upload" className="cursor-pointer">
                                    <Button variant="secondary" asChild>
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

                            {/* Formulário Dados Pessoais */}
                            <form className="flex flex-col gap-6 lg:col-span-2" onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="nome_completo">Nome Completo</Label>
                                        <Input
                                            id="nome_completo"
                                            placeholder="Digite seu nome"
                                            value={nomeCompleto}
                                            onChange={(e) => setNomeCompleto(e.target.value)}
                                        />
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="Digite seu email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="cpf">CPF</Label>
                                        <Input
                                            id="cpf"
                                            placeholder="Digite seu CPF"
                                            value={cpf}
                                            onChange={(e) => setCpf(e.target.value)}
                                        />
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <Label>Data de Nascimento</Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className={cn(
                                                        "justify-start text-left font-normal",
                                                        !dataNascimento && "text-muted-foreground"
                                                    )}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {dataNascimento
                                                        ? format(dataNascimento, "dd/MM/yyyy")
                                                        : "Selecione uma data"}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={dataNascimento}
                                                    onSelect={setDataNascimento}
                                                    captionLayout="dropdown"
                                                    fromYear={1960}
                                                    toYear={new Date().getFullYear()}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <Label>Telefone</Label>
                                        <Input
                                            id="telefone"
                                            placeholder="(XX) XXXXX-XXXX"
                                            value={telefone}
                                            onChange={(e) => setTelefone(e.target.value)}
                                        />
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <Label>Gênero</Label>
                                        <select
                                            id="genero"
                                            className="border rounded-md h-10 px-3"
                                            value={genero}
                                            onChange={(e) => setGenero(e.target.value)}
                                        >
                                            <option value="">Selecione</option>
                                            <option value="M">Masculino</option>
                                            <option value="F">Feminino</option>
                                        </select>
                                    </div>
                                </div>

                                <Separator />

                                <h3 className="text-xl font-semibold">Endereço</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="logradouro">Logradouro</Label>
                                        <Input
                                            id="logradouro"
                                            placeholder="Rua, Avenida, etc"
                                            value={logradouro}
                                            onChange={(e) => setLogradouro(e.target.value)}
                                        />
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="numero">Número</Label>
                                        <Input
                                            id="numero"
                                            placeholder="Número"
                                            value={numero}
                                            onChange={(e) => setNumero(e.target.value)}
                                        />
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="complemento">Complemento</Label>
                                        <Input
                                            id="complemento"
                                            placeholder="Apartamento, bloco, etc"
                                            value={complemento}
                                            onChange={(e) => setComplemento(e.target.value)}
                                        />
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="bairro">Bairro</Label>
                                        <Input
                                            id="bairro"
                                            placeholder="Digite o bairro"
                                            value={bairro}
                                            onChange={(e) => setBairro(e.target.value)}
                                        />
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="cidade">Cidade</Label>
                                        <Input
                                            id="cidade"
                                            placeholder="Digite a cidade"
                                            value={cidade}
                                            onChange={(e) => setCidade(e.target.value)}
                                        />
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="estado">Estado (UF)</Label>
                                        <Input
                                            id="estado"
                                            placeholder="Ex: SP, RJ"
                                            maxLength={2}
                                            value={estado}
                                            onChange={(e) => setEstado(e.target.value.toUpperCase())}
                                        />
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="cep">CEP</Label>
                                        <Input
                                            id="cep"
                                            placeholder="00000-000"
                                            value={cep}
                                            onChange={(e) => setCep(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <Button type="submit">
                                        <UserRoundPen/> Salvar Alterações
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