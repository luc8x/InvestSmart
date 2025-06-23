"use client";
import { useState } from "react";
import { useRouter } from 'next/navigation';
import Image from "next/image";
import Alert from "@/components/alert";
import { User, Eye, EyeOff, DoorOpen } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { loginUser } from "@/utils/usersServices";

export default function loginPage() {
    const router = useRouter();
    const [cpf, setCpf] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setLoading(true);
        setError("");

        if (!cpf.trim() || !password.trim()) {
            setError("Por favor, preencha todos os campos.");
            setLoading(false);
            return;
        }

        try {
            const ok = await loginUser(cpf, password);
            if (ok) {
                router.push('/painel');
            } else {
                setError("Credenciais Inválida.");
            }
        } catch (err: any) {
            setError(err.message || "Erro inesperado ao fazer login.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
            {error && <Alert message={error} type="error" onClose={() => setError("")} />}
            <div className="mx-auto max-w-[1100px] rounded-3xl border border-purple/70 shadow-lg border-purple-800 card-bg-d-purple">
                <div className="grid grid-cols-1 md:grid-cols-2 h-full overflow-hidden rounded-3xl">
                    <div className="p-8 flex flex-col justify-center gap-6">
                        <div>
                            <h1 className="text-2xl font-bold text-white">
                                Bem-vindo de volta!
                                <br />
                                Faça login na sua conta
                            </h1>
                        </div>

                        <form
                            className="flex flex-col gap-4 p-6 rounded-xl shadow-lg border border-white/30 backdrop-blur bg-white/10"
                            onSubmit={handleSubmit}
                        >
                            <div>
                                <p className="font-semibold text-white mb-2">
                                    Acesse com suas credenciais
                                </p>

                                <div className="mb-4">
                                    <label htmlFor="cpf" className="text-white block mb-1">
                                        CPF
                                    </label>
                                    <div className="flex items-center shadow-sm bg-transparent border border-white/70 rounded-lg">
                                        <input
                                            type="text"
                                            id="cpf"
                                            name="cpf"
                                            value={cpf}
                                            onChange={(e) => setCpf(e.target.value)}
                                            className="flex-1 bg-transparent text-white placeholder-white/70 focus:outline-none py-2 px-3 pr-0 rounded-l-lg"
                                            placeholder="Digite seu CPF"
                                            required
                                        />
                                        <User className="text-white w-10 h-5" />
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="password" className="text-white block mb-1">
                                        Senha
                                    </label>
                                    <div className="flex items-center rounded-lg shadow-sm bg-transparent border border-white/70">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            id="password"
                                            name="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="flex-1 bg-transparent text-white placeholder-white/70 focus:outline-none py-2 px-3 pr-0"
                                            placeholder="Digite sua senha"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="mx-2 text-white"
                                            aria-label="Mostrar ou ocultar senha"
                                        >
                                            {showPassword ? (
                                                <EyeOff className="w-6 h-5" />
                                            ) : (
                                                <Eye className="w-6 h-5" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox id="remember" />
                                <label htmlFor="remember" className="text-sm text-white">
                                    Lembrar de mim?
                                </label>
                            </div>
                            <div className="text-white text-sm">
                                <p className="mb-2">
                                    Não tem conta?{" "}
                                    <a href="/cadastre-se" className="underline">
                                        Cadastre-se
                                    </a>
                                </p>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-2 btn-d-purple transition-colors text-white font-semibold rounded-lg flex justify-center items-center gap-2 cursor-pointer disabled:opacity-50"
                                >
                                    <DoorOpen />
                                    {loading ? (
                                        <span className="flex items-center gap-1">
                                            Carregando
                                            <span className="dot-animate">.</span>
                                            <span className="dot-animate delay-150">.</span>
                                            <span className="dot-animate delay-300">.</span>
                                        </span>
                                    ) : (
                                        "Login"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="hidden md:block">
                        <Image
                            src="/img/tinta.png"
                            alt="Imagem decorativa de tinta"
                            width={600}
                            height={550}
                            className="h-full w-full object-cover rounded-r-3xl"
                            unoptimized
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
