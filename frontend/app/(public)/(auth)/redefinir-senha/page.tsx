"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import Alert from "@/components/ui/alert";
import { Lock, Eye, EyeOff } from "lucide-react";
import { confirmResetPassword } from "@/services/users/userServices/usersServices";
import { Button } from "@/components/ui";
import Link from "next/link";

export default function ResetPasswordPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [token, setToken] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        const tokenParam = searchParams.get('token');
        if (tokenParam) {
            setToken(tokenParam);
        } else {
            setError("Token não encontrado na URL.");
        }
    }, [searchParams]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setLoading(true);
        setError("");
        setSuccess(false);

        if (!newPassword.trim()) {
            setError("Por favor, digite a nova senha.");
            setLoading(false);
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("As senhas não coincidem.");
            setLoading(false);
            return;
        }

        if (newPassword.length < 8) {
            setError("A senha deve ter pelo menos 8 caracteres.");
            setLoading(false);
            return;
        }

        try {
            const response = await confirmResetPassword(token, newPassword);
            
            if (response.success) {
                setSuccess(true);
                setNewPassword("");
                setConfirmPassword("");
                setTimeout(() => {
                    router.push('/login');
                }, 3000);
            } else {
                setError(response.error?.message || "Erro ao redefinir senha.");
            }
        } catch (err: any) {
            setError(err.response?.data?.error?.message || "Erro inesperado ao redefinir senha.");
        } finally {
            setLoading(false);
        }
    };

    if (!token && !error) {
        return (
            <div className="flex items-center justify-center min-h-screen p-4">
                <div className="text-white">Carregando...</div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-screen p-4">
            {error && <Alert message={error} type="error" onClose={() => setError("")} />}
            {success && <Alert message="Senha redefinida com sucesso! Redirecionando para o login..." type="success" onClose={() => setSuccess(false)} />}
            <div className="mx-auto max-w-[1200px] w-full rounded-3xl border border-purple-200/30 shadow-2xl card-bg-d-purple backdrop-blur-sm">
                <div className="grid grid-cols-1 overflow-hidden rounded-3xl">
                    <div className="p-8 lg:p-12 flex flex-col justify-center gap-8 relative">                        
                        <div className="space-y-2">
                            <h1 className="text-3xl lg:text-4xl font-bold text-white leading-tight">
                                Redefinir Senha
                            </h1>
                            <p className="text-purple-200/80 text-lg">
                                Digite sua nova senha
                            </p>
                        </div>

                        <form
                            className="flex flex-col gap-6 p-8 rounded-2xl shadow-2xl border border-white/20 backdrop-blur-md bg-white/5 hover:bg-white/10 transition-all duration-300"
                            onSubmit={handleSubmit}
                        >
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label htmlFor="newPassword" className="text-white/90 block text-sm font-medium">
                                        Nova Senha
                                    </label>
                                    <div className="group relative">
                                        <div className="flex items-center bg-white/5 border border-white/30 rounded-xl hover:border-white/50 focus-within:border-purple-400 focus-within:bg-white/10 transition-all duration-300">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                id="newPassword"
                                                name="newPassword"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                className="flex-1 bg-transparent text-white placeholder-white/50 focus:outline-none py-2 px-4 rounded-xl"
                                                placeholder="Digite sua nova senha"
                                                required
                                                minLength={8}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="text-white/60 hover:text-purple-400 transition-colors mr-3"
                                            >
                                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="confirmPassword" className="text-white/90 block text-sm font-medium">
                                        Confirmar Nova Senha
                                    </label>
                                    <div className="group relative">
                                        <div className="flex items-center bg-white/5 border border-white/30 rounded-xl hover:border-white/50 focus-within:border-purple-400 focus-within:bg-white/10 transition-all duration-300">
                                            <input
                                                type={showConfirmPassword ? "text" : "password"}
                                                id="confirmPassword"
                                                name="confirmPassword"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                className="flex-1 bg-transparent text-white placeholder-white/50 focus:outline-none py-2 px-4 rounded-xl"
                                                placeholder="Confirme sua nova senha"
                                                required
                                                minLength={8}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="text-white/60 hover:text-purple-400 transition-colors mr-3"
                                            >
                                                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-4">
                                    <Button
                                        type="submit"
                                        disabled={loading || !token}
                                        className="w-full py-5 btn-d-purple transition-all duration-300 text-white font-semibold rounded-xl flex justify-center items-center gap-3 cursor-pointer disabled:opacity-50 hover:shadow-xl transform"
                                    >
                                        <Lock className="w-5 h-5" />
                                        {loading ? (
                                            <span className="flex items-center gap-1">
                                                Redefinindo
                                                <span className="dot-animate">.</span>
                                                <span className="dot-animate delay-150">.</span>
                                                <span className="dot-animate delay-300">.</span>
                                            </span>
                                        ) : (
                                            "Redefinir Senha"
                                        )}
                                    </Button>
                                    
                                    <div className="text-center">
                                        <p className="text-white/70 text-sm">
                                            Lembrou da senha?{" "}
                                            <Link 
                                                href="/login" 
                                                className="text-purple-300 hover:text-purple-200 underline underline-offset-2 font-medium transition-colors duration-200"
                                            >
                                                Fazer Login
                                            </Link>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}