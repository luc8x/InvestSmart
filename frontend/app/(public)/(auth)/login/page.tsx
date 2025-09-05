"use client";
import { useState } from "react";
import { useRouter } from 'next/navigation';
import Alert from "@/components/ui/alert";
import { User, Eye, EyeOff, DoorOpen } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { loginUser } from "@/lib/userServices/usersServices";
import { Button } from "@/components/ui";
import Link from "next/link";

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

        const cpfLimpo = cpf.replace(/\D/g, "");

        try {
            const ok = await loginUser(cpfLimpo, password);
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
        <div className="flex items-center justify-center min-h-screen p-4">
            {error && <Alert message={error} type="error" onClose={() => setError("")} />}
            <div className="mx-auto max-w-[1200px] w-full rounded-3xl border border-purple-200/30 shadow-2xl card-bg-d-purple backdrop-blur-sm">
                <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px] overflow-hidden rounded-3xl">
                    <div className="p-8 lg:p-12 flex flex-col justify-center gap-8 relative">                        
                        <div className="space-y-2">
                            <h1 className="text-3xl lg:text-4xl font-bold text-white leading-tight">
                                Bem-vindo de volta!
                            </h1>
                            <p className="text-purple-200/80 text-lg">
                                Faça login na sua conta
                            </p>
                        </div>

                        <form
                            className="flex flex-col gap-6 p-8 rounded-2xl shadow-2xl border border-white/20 backdrop-blur-md bg-white/5 hover:bg-white/10 transition-all duration-300"
                            onSubmit={handleSubmit}
                        >
                            <div className="space-y-6">
                                <div className="text-center">
                                    <p className="font-semibold text-white/90 text-lg">
                                        Acesse com suas credenciais
                                    </p>
                                    <div className="w-16 h-0.5 bg-gradient-to-r from-purple-400 to-blue-400 mx-auto mt-2"></div>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="cpf" className="text-white/90 block text-sm font-medium">
                                        CPF
                                    </label>
                                    <div className="group relative">
                                        <div className="flex items-center bg-white/5 border border-white/30 rounded-xl hover:border-white/50 focus-within:border-purple-400 focus-within:bg-white/10 transition-all duration-300">
                                            <input
                                                type="text"
                                                id="cpf"
                                                name="cpf"
                                                value={cpf}
                                                onChange={(e) => {
                                                    const numeros = e.target.value.replace(/\D/g, "");
                                                    let masked = numeros;
                                                    if (numeros.length > 3) masked = numeros.slice(0, 3) + "." + numeros.slice(3);
                                                    if (numeros.length > 6) masked = masked.slice(0, 7) + "." + masked.slice(7);
                                                    if (numeros.length > 9) masked = masked.slice(0, 11) + "-" + masked.slice(11, 13);
                                                    setCpf(masked);
                                                }}
                                                className="flex-1 bg-transparent text-white placeholder-white/50 focus:outline-none py-2 px-4 rounded-xl"
                                                placeholder="Digite seu CPF"
                                                required
                                            />
                                            <User className="text-white/60 w-5 h-5 mr-3 group-focus-within:text-purple-400 transition-colors" />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="password" className="text-white/90 block text-sm font-medium">
                                        Senha
                                    </label>
                                    <div className="group relative">
                                        <div className="flex items-center bg-white/5 border border-white/30 rounded-xl hover:border-white/50 focus-within:border-purple-400 focus-within:bg-white/10 transition-all duration-300">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                id="password"
                                                name="password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="flex-1 bg-transparent visited:bg-transparent text-white placeholder-white/50 focus:outline-none py-2 px-4 rounded-xl"
                                                placeholder="Digite sua senha"
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="mr-3 text-white/60 hover:text-purple-400 transition-colors duration-200"
                                                aria-label="Mostrar ou ocultar senha"
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="w-5 h-5" />
                                                ) : (
                                                    <Eye className="w-5 h-5" />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center space-x-3">
                                        <Checkbox id="remember" className="border-white/30 data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500" />
                                        <label htmlFor="remember" className="text-sm text-white/80 cursor-pointer hover:text-white transition-colors">
                                            Lembrar de mim
                                        </label>
                                    </div>
                                    <a
                                    href="/esqueceu-a-senha"
                                    className="text-purple-300 hover:underline"
                                    >
                                    Esqueceu a senha?
                                    </a>
                                </div>
                                
                                <div className="space-y-4">
                                    <Button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full py-5 btn-d-purple transition-all duration-300 text-white font-semibold rounded-xl flex justify-center items-center gap-3 cursor-pointer disabled:opacity-50 hover:shadow-xl transform"
                                    >
                                        <DoorOpen className="w-5 h-5" />
                                        {loading ? (
                                            <span className="flex items-center gap-1">
                                                Entrando
                                                <span className="dot-animate">.</span>
                                                <span className="dot-animate delay-150">.</span>
                                                <span className="dot-animate delay-300">.</span>
                                            </span>
                                        ) : (
                                            "Entrar na conta"
                                        )}
                                    </Button>
                                    
                                    <div className="text-center">
                                        <p className="text-white/70 text-sm">
                                            Não tem conta?{" "}
                                            <Link 
                                                href="/cadastre-se" 
                                                className="text-purple-300 hover:text-purple-200 underline underline-offset-2 font-medium transition-colors duration-200"
                                            >
                                                Cadastre-se aqui
                                            </Link>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>

                    <div className="hidden lg:block relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-blue-600/20 z-10"></div>
                        <img
                            src="/gif/tinta.gif"
                            alt="Efeito de tinta"
                            width={600}
                            height={600}
                            className="h-full w-full object-cover rounded-r-3xl transition-transform duration-700"
                        />
                        {/* Overlay decorativo */}
                        <div className="absolute bottom-12 left-8 right-8 z-20">
                            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                                <h3 className="text-white font-semibold text-lg mb-2">InvestSmart</h3>
                                <p className="text-white/80 text-sm">
                                    Sua plataforma completa para investimentos inteligentes e finanças.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
