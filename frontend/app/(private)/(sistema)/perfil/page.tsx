"use client";

import { useState, useEffect, useReducer, useMemo, useCallback } from "react";
import { format } from "date-fns";
import { debounce } from "lodash";
import { Camera, UserRoundPen, Lock, BadgeInfo, ChevronLeft, Calendar as CalendarIcon } from 'lucide-react';
import { toast } from "sonner";
import { mask, unMask } from 'remask';

// Componentes UI
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    Input,
    Label,
    Button,
    Skeleton,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    Popover,
    PopoverContent,
    PopoverTrigger,
    Separator
} from "@/components/ui/index";
import { cn } from "@/lib/utils";

// Serviços
import { getUserFromCookies, updateUserInfo } from '@/utils/usersServices';

interface User {
    id: number;
    nomeCompleto: string;
    email: string;
    cpf: string;
    foto: string | null;
    fotoFile: File | null;
    telefone: string;
    genero: 'M' | 'F' | '';
    logradouro: string;
    numero: string;
    complemento: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
    dataNascimento: Date | undefined;
}

interface Estado {
    sigla: string;
    nome: string;
}

interface Cidade {
    nome: string;
}

interface State {
    user: User;
    isLoading: boolean;
    isLoadingEstados: boolean;
    isLoadingCidades: boolean;
    estados: Estado[];
    cidades: Cidade[];
    error: Error | null;
}

const initialState: State = {
    user: {
        id: 0,
        nomeCompleto: '',
        email: '',
        cpf: '',
        foto: null,
        fotoFile: null,
        telefone: '',
        genero: '',
        logradouro: '',
        numero: '',
        complemento: '',
        bairro: '',
        cidade: '',
        estado: '',
        cep: '',
        dataNascimento: undefined,
    },
    isLoading: true,
    isLoadingEstados: true,
    isLoadingCidades: false,
    estados: [],
    cidades: [],
    error: null,
};

function reducer(state: State, action: any): State {
    switch (action.type) {
        case 'SET_USER':
            return { ...state, user: { ...state.user, ...action.payload } };
        case 'SET_LOADING':
            return { ...state, isLoading: action.payload };
        case 'SET_LOADING_ESTADOS':
            return { ...state, isLoadingEstados: action.payload };
        case 'SET_LOADING_CIDADES':
            return { ...state, isLoadingCidades: action.payload };
        case 'SET_ESTADOS':
            return { ...state, estados: action.payload, isLoadingEstados: false };
        case 'SET_CIDADES':
            return { ...state, cidades: action.payload, isLoadingCidades: false };
        case 'SET_ERROR':
            return { ...state, error: action.payload };
        default:
            return state;
    }
}

const parseDate = (date: string | null | undefined): Date | null => {
    if (!date) return null;
    const d = new Date(date);
    return isNaN(d.getTime()) ? null : d;
};

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
};

const LoadingSkeleton = ({ className = "" }: { className?: string }) => (
    <Skeleton className={cn("h-9 w-full rounded-md border", className)} />
);

const ProfilePhotoUpload = ({ 
    photo, 
    onChange,
    isLoading 
}: { 
    photo: string | null, 
    onChange: (file: File) => void,
    isLoading: boolean
}) => {
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) onChange(file);
    };

    return (
        <div className="flex flex-col items-center gap-4">
            {isLoading ? (
                <Skeleton className="rounded-full w-70 h-70" />
            ) : (
                <img
                    src={photo || "/img/avatar-placeholder.png"}
                    alt="Foto de perfil"
                    className="rounded-full w-70 h-70 object-cover border border-gray-300 shadow-lg p-1"
                />
            )}
            <label htmlFor="foto-upload" className="cursor-pointer">
                <Button variant="outline" disabled={isLoading}>
                    <Camera className="mr-2 h-4 w-4" /> Alterar Foto
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
    );
};

export default function PerfilPage() {
    const [state, dispatch] = useReducer(reducer, initialState);

    const fetchEstados = useCallback(async () => {
        try {
            const res = await fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados");
            const data = await res.json();
            const estadosOrdenados = data.sort((a: Estado, b: Estado) => a.nome.localeCompare(b.nome));
            dispatch({ type: 'SET_ESTADOS', payload: estadosOrdenados });
        } catch (err) {
            dispatch({ type: 'SET_ERROR', payload: err as Error });
            toast.error("Erro ao carregar estados");
        }
    }, []);

    const fetchCidades = useCallback(async (estado: string) => {
        if (!estado) {
            dispatch({ type: 'SET_CIDADES', payload: [] });
            return;
        }

        try {
            dispatch({ type: 'SET_LOADING_CIDADES', payload: true });
            const res = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estado}/municipios`);
            const data = await res.json();
            dispatch({ type: 'SET_CIDADES', payload: data.map((c: any) => ({ nome: c.nome })) });
        } catch (err) {
            dispatch({ type: 'SET_ERROR', payload: err as Error });
            toast.error("Erro ao carregar cidades");
        }
    }, []);

    const fetchAddressByCEP = useMemo(
        () => debounce(async (cep: string) => {
            const cleanCEP = cep.replace(/\D/g, '');
            if (cleanCEP.length !== 8) return;

            try {
                dispatch({ 
                    type: 'SET_USER', 
                    payload: {
                        logradouro: '',
                        bairro: '',
                        cidade: '',
                        estado: ''
                    }
                });

                const response = await fetch(`https://viacep.com.br/ws/${cleanCEP}/json/`);
                const data = await response.json();

                if (data.erro) {
                    toast.error('Nenhum endereço encontrado com o CEP informado.');
                    return;
                }

                dispatch({ 
                    type: 'SET_USER', 
                    payload: {
                        logradouro: data.logradouro || '',
                        bairro: data.bairro || '',
                        cidade: data.localidade || '',
                        estado: data.uf || '',
                    }
                });
            } catch (error) {
                toast.error(`Erro ao buscar CEP: ${error}`);
            }
        }, 500),
        []
    );

    useEffect(() => {
        const loadUserData = () => {
            try {
                const { user: userData, perfil: perfilData } = getUserFromCookies();
                const foto = localStorage.getItem('user_foto');

                if (userData) {
                    dispatch({
                        type: 'SET_USER',
                        payload: {
                            nomeCompleto: userData.nome_completo,
                            email: userData.email,
                            cpf: mask((userData.cpf), ['999.999.999-99']),
                            dataNascimento: userData.data_nascimento ? parseDate(userData.data_nascimento) : undefined,
                            foto: foto || null,
                            telefone: mask((perfilData?.telefone || ''), ['(99) 99999-9999']),
                            genero: perfilData?.genero || '',
                            logradouro: perfilData?.logradouro || '',
                            numero: perfilData?.numero || '',
                            complemento: perfilData?.complemento || '',
                            bairro: perfilData?.bairro || '',
                            cidade: perfilData?.cidade || '',
                            estado: perfilData?.estado || '',
                            cep: mask((perfilData?.cep || ''), ['99999-999']),
                        }
                    });
                }
            } catch (error) {
                dispatch({ type: 'SET_ERROR', payload: error as Error });
                toast.error('Erro ao carregar dados do usuário.');
            } finally {
                dispatch({ type: 'SET_LOADING', payload: false });
            }
        };

        loadUserData();
        fetchEstados();

        return () => {
            if (state.user.foto) {
                URL.revokeObjectURL(state.user.foto);
            }
            fetchAddressByCEP.cancel();
        };
    }, [fetchAddressByCEP, fetchEstados]);

    useEffect(() => {
        if (state.user.estado) {
            fetchCidades(state.user.estado);
        }
    }, [state.user.estado, fetchCidades]);

    const handleChange = (field: keyof User, value: any) => {
        dispatch({ 
            type: 'SET_USER', 
            payload: { [field]: value }
        });
    };

    const handleFileChange = (file: File) => {
        const previewUrl = URL.createObjectURL(file);
        handleChange('fotoFile', file);
        handleChange('foto', previewUrl);
    };

    const handleCepChange = (value: string) => {
        const maskedCep = mask(unMask(value), ['99999-999']);
        handleChange('cep', maskedCep);
        
        if (unMask(value).length === 8) {
            fetchAddressByCEP(maskedCep);
        }
    };

    const validateForm = (): string[] => {
        const errors = [];
        if (!state.user.email) errors.push('Email é obrigatório');
        if (!state.user.telefone) errors.push('Telefone é obrigatório');
        if (!state.user.genero) errors.push('Gênero é obrigatório');
        return errors;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const errors = validateForm();
        if (errors.length > 0) {
            toast.error('Erros no formulário', {
                description:(
                    <span className="text-red-500">{errors.join(', ')}</span>
                )
            });
            return;
        }

        let fotoBase64 = null;
        if (state.user.fotoFile) {
            try {
                fotoBase64 = await fileToBase64(state.user.fotoFile);
            } catch (error) {
                toast.error('Erro ao processar a imagem');
                return;
            }
        }

        const submitData = new FormData();
        submitData.append('email', state.user.email);
        submitData.append('telefone', unMask(state.user.telefone));
        submitData.append('genero', state.user.genero);
        submitData.append('logradouro', state.user.logradouro);
        submitData.append('numero', unMask(state.user.numero));
        submitData.append('complemento', state.user.complemento);
        submitData.append('bairro', state.user.bairro);
        submitData.append('cidade', state.user.cidade);
        submitData.append('estado', state.user.estado);
        submitData.append('cep', unMask(state.user.cep));

        if (fotoBase64) {
            submitData.append('foto', fotoBase64);
        }

        try {
            await updateUserInfo(submitData);
            toast.success('Perfil atualizado com sucesso!');
        } catch (error: any) {
            dispatch({ type: 'SET_ERROR', payload: error });
            toast.error('Não foi possível atualizar o perfil.', {
                description: 'Corrija os campos obrigatórios e tente novamente.'
            });
        }
    };

    if (state.error) {
        return (
            <div className="flex flex-col items-center justify-center h-full">
                <h2 className="text-2xl font-bold text-red-600">Ocorreu um erro</h2>
                <p className="text-muted-foreground">{state.error.message}</p>
                <Button 
                    className="mt-4" 
                    onClick={() => window.location.reload()}
                >
                    Recarregar Página
                </Button>
            </div>
        );
    }

    return (
        <div className="flex flex-1 flex-col gap-4">
            <div className="grid auto-rows-min gap-4 md:grid-cols-1">
                <Card className="text-black shadow-lg bg-white">
                    <CardHeader className="flex flex-row items-start justify-between">
                        <div>
                            <CardTitle className="text-lg">
                                Olá, {state.user.nomeCompleto || 'Usuário'}
                            </CardTitle>
                            <CardDescription>
                                Sempre mantenha suas informações atualizadas!
                            </CardDescription>
                        </div>
                    </CardHeader>
                    <hr />
                    <CardContent className="flex flex-col gap-8">
                        <div>
                            <h2 className="text-3xl font-semibold tracking-tight">
                                Dados do Usuário
                            </h2>
                            <p className="text-muted-foreground text-sm">
                                Gerencie suas informações pessoais e endereço
                            </p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <ProfilePhotoUpload 
                                photo={state.user.foto} 
                                onChange={handleFileChange}
                                isLoading={state.isLoading}
                            />

                            <form className="flex flex-col gap-6 lg:col-span-2" onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Nome Completo */}
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="nome_completo">Nome Completo: </Label>
                                        {state.isLoading ? (
                                            <LoadingSkeleton />
                                        ) : (
                                            <div className="relative">
                                                <Input
                                                    id="nome_completo"
                                                    placeholder="Digite seu nome"
                                                    disabled
                                                    value={state.user.nomeCompleto}
                                                    className="pr-10"
                                                />
                                                <Lock size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400/60" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Email */}
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="email">
                                            Email: <span className="text-red-400" title="Campo Obrigatório">*</span>
                                        </Label>
                                        {state.isLoading ? (
                                            <LoadingSkeleton />
                                        ) : (
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="Digite seu email"
                                                disabled={state.isLoading}
                                                value={state.user.email}
                                                onChange={(e) => handleChange('email', e.target.value)}
                                            />
                                        )}
                                    </div>

                                    {/* CPF */}
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="cpf">CPF: </Label>
                                        {state.isLoading ? (
                                            <LoadingSkeleton />
                                        ) : (
                                            <div className="relative">
                                                <Input
                                                    id="cpf"
                                                    placeholder="Digite seu CPF"
                                                    disabled
                                                    value={state.user.cpf}
                                                    className="pr-10"
                                                />
                                                <Lock size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400/60" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Data de Nascimento */}
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="data_nascimento">
                                            Data de Nascimento:<span className="text-red-400" title="Campo Obrigatório">*</span>
                                        </Label>
                                        {state.isLoading ? (
                                            <LoadingSkeleton />
                                        ) : (
                                            <Button
                                                id="data_nascimento"
                                                variant="outline"
                                                disabled={true}
                                                className={cn(
                                                    "justify-start text-left font-normal flex justify-between",
                                                    !state.user.dataNascimento && "text-muted-foreground"
                                                )}
                                            >   
                                                <div className="flex align-center">
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {state.user.dataNascimento ? format(state.user.dataNascimento, 'dd/MM/yyyy') : 'Selecione uma data'}
                                                </div>
                                                <Lock size={15} className="text-gray-400" />
                                            </Button>
                                        )}
                                    </div>

                                    {/* Telefone */}
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="telefone">
                                            Telefone: <span className="text-red-400" title="Campo Obrigatório">*</span>
                                        </Label>
                                        {state.isLoading ? (
                                            <LoadingSkeleton />
                                        ) : (
                                            <Input
                                                id="telefone"
                                                placeholder="(XX) XXXXX-XXXX"
                                                disabled={state.isLoading}
                                                value={state.user.telefone}
                                                onChange={(e) => handleChange('telefone', mask(e.target.value, ['(99) 99999-9999']))}
                                            />
                                        )}
                                    </div>

                                    {/* Gênero */}
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="genero">
                                            Gênero: <span className="text-red-400" title="Campo Obrigatório">*</span>
                                        </Label>
                                        {state.isLoading ? (
                                            <LoadingSkeleton />
                                        ) : (
                                            <Select
                                                value={state.user.genero}
                                                onValueChange={(value) => handleChange('genero', value)}
                                                disabled={state.isLoading}
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
                                    Endereço <span className="text-black" title="Campos Opcionais"><BadgeInfo size={15} /></span>
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* CEP */}
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="cep">CEP:</Label>
                                        {state.isLoading ? (
                                            <LoadingSkeleton />
                                        ) : (
                                            <div className="flex flex-col gap-1">
                                                <Input
                                                    id="cep"
                                                    placeholder="Digite seu CEP"
                                                    value={state.user.cep}
                                                    onChange={(e) => handleCepChange(e.target.value)}
                                                />
                                                <div>
                                                    <a
                                                        href="https://www.buscacep.correios.com.br/"
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-sm text-gray-500 hover:underline"
                                                    >
                                                        Não sabe seu CEP?
                                                    </a>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Logradouro */}
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="logradouro">Logradouro:</Label>
                                        {state.isLoading ? (
                                            <LoadingSkeleton />
                                        ) : (
                                            <Input
                                                id="logradouro"
                                                placeholder="Rua, Avenida, etc"
                                                disabled={state.isLoading}
                                                value={state.user.logradouro}
                                                onChange={(e) => handleChange('logradouro', e.target.value)}
                                            />
                                        )}
                                    </div>

                                    {/* Número */}
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="numero">Número:</Label>
                                        {state.isLoading ? (
                                            <LoadingSkeleton />
                                        ) : (
                                            <Input
                                                id="numero"
                                                placeholder="Número"
                                                disabled={state.isLoading}
                                                value={state.user.numero}
                                                onChange={(e) => handleChange('numero', e.target.value)}
                                            />
                                        )}
                                    </div>

                                    {/* Complemento */}
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="complemento">Complemento:</Label>
                                        {state.isLoading ? (
                                            <LoadingSkeleton />
                                        ) : (
                                            <Input
                                                id="complemento"
                                                placeholder="Apartamento, bloco, etc"
                                                disabled={state.isLoading}
                                                value={state.user.complemento}
                                                onChange={(e) => handleChange('complemento', e.target.value)}
                                            />
                                        )}
                                    </div>

                                    {/* Estado */}
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="estado">Estado:</Label>
                                        {state.isLoadingEstados ? (
                                            <LoadingSkeleton />
                                        ) : (
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button 
                                                        variant="outline" 
                                                        role="combobox" 
                                                        className="w-full justify-between" 
                                                        id="estado"
                                                        disabled={state.isLoading}
                                                    >
                                                        {state.user.estado
                                                            ? state.estados.find((e) => e.sigla === state.user.estado)?.nome
                                                            : "Selecione o Estado"}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-[300px] p-0">
                                                    <Command>
                                                        <CommandInput placeholder="Procurar Estado..." className="h-9" />
                                                        <CommandList>
                                                            <CommandEmpty>Nenhum estado encontrado.</CommandEmpty>
                                                            <CommandGroup>
                                                                {state.estados.map((estado) => (
                                                                    <CommandItem
                                                                        key={estado.sigla}
                                                                        value={estado.sigla}
                                                                        onSelect={() => handleChange("estado", estado.sigla)}
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

                                    {/* Cidade */}
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="cidade">Cidade:</Label>
                                        {state.isLoadingCidades ? (
                                            <LoadingSkeleton />
                                        ) : (
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button 
                                                        id="cidade"
                                                        variant="outline"
                                                        role="combobox"
                                                        className="w-full justify-between"
                                                        disabled={!state.user.estado || state.isLoading}
                                                    >
                                                        {state.user.cidade || "Selecione a Cidade"}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-[300px] p-0">
                                                    <Command>
                                                        <CommandInput placeholder="Procurar Cidade..." className="h-9"  />
                                                        <CommandList>
                                                            <CommandEmpty>Nenhuma cidade encontrada.</CommandEmpty>
                                                            <CommandGroup>
                                                                {state.cidades.map((cidade) => (
                                                                    <CommandItem
                                                                        key={cidade.nome}
                                                                        value={cidade.nome}
                                                                        onSelect={() => handleChange("cidade", cidade.nome)}
                                                                    >
                                                                        {cidade.nome}
                                                                    </CommandItem>
                                                                ))}
                                                            </CommandGroup>
                                                        </CommandList>
                                                    </Command>
                                                </PopoverContent>
                                            </Popover>
                                        )}
                                    </div>

                                    {/* Bairro */}
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="bairro">Bairro:</Label>
                                        {state.isLoading ? (
                                            <LoadingSkeleton />
                                        ) : (
                                            <Input
                                                id="bairro"
                                                placeholder="Digite o bairro"
                                                disabled={state.isLoading}
                                                value={state.user.bairro}
                                                onChange={(e) => handleChange('bairro', e.target.value)}
                                            />
                                        )}
                                    </div>
                                </div>

                                <div className="flex justify-end gap-2">
                                    <Button 
                                        type="button" 
                                        variant="secondary" 
                                        onClick={() => window.history.back()}
                                        disabled={state.isLoading}
                                    >
                                        <ChevronLeft size={15} className="mr-2" /> Voltar
                                    </Button>
                                    <Button 
                                        type="submit" 
                                        variant="outline" 
                                        disabled={state.isLoading}
                                    >
                                        <UserRoundPen size={15} className="mr-2" /> Salvar Alterações
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}