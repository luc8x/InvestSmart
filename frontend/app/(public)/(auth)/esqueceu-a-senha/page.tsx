"use client";
import { useState } from "react";
import Alert from "@/components/ui/alert";
import { AtSign, Mail } from "lucide-react";
import { resetPassword } from "@/lib/userServices/usersServices";
import { Button } from "@/components/ui";
import Link from "next/link";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setLoading(true);
        setError("");
        setSuccess(false);

        if (!email.trim()) {
            setError("Por favor, preencha o campo E-mail.");
            setLoading(false);
            return;
        }

        try {
            const response = await resetPassword(email);
            if (response.success) {
                setSuccess(true);
                setEmail("");
            } else {
                setError(response.error?.message || "Erro ao enviar e-mail de recuperação.");
            }
        } catch (err: any) {
            setError(err.response?.data?.error?.message || "Erro inesperado ao enviar e-mail.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen p-4">
            {error && <Alert message={error} type="error" onClose={() => setError("")} />}
            {success && <Alert message="Se o e-mail estiver cadastrado, você receberá as instruções para redefinir sua senha." type="success" onClose={() => setSuccess(false)} />}
            <div className="mx-auto max-w-[1200px] w-full rounded-3xl border border-purple-200/30 shadow-2xl card-bg-d-purple backdrop-blur-sm">
                <div className="grid grid-cols-1 overflow-hidden rounded-3xl">
                    <div className="p-8 lg:p-12 flex flex-col justify-center gap-8 relative">                        
                        <div className="space-y-2">
                            <h1 className="text-3xl lg:text-4xl font-bold text-white leading-tight">
                                Esqueceu a senha?
                            </h1>
                            <p className="text-purple-200/80 text-lg">
                                Digite seu E-mail e receba um link para redefinir sua senha
                            </p>
                        </div>

                        <form
                            className="flex flex-col gap-6 p-8 rounded-2xl shadow-2xl border border-white/20 backdrop-blur-md bg-white/5 hover:bg-white/10 transition-all duration-300"
                            onSubmit={handleSubmit}
                        >
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-white/90 block text-sm font-medium">
                                        E-mail
                                    </label>
                                    <div className="group relative">
                                        <div className="flex items-center bg-white/5 border border-white/30 rounded-xl hover:border-white/50 focus-within:border-purple-400 focus-within:bg-white/10 transition-all duration-300">
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="flex-1 bg-transparent text-white placeholder-white/50 focus:outline-none py-2 px-4 rounded-xl"
                                                placeholder="Digite seu e-mail"
                                                required
                                            />
                                            <AtSign className="text-white/60 w-5 h-5 mr-3 group-focus-within:text-purple-400 transition-colors" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-4">
                                    <Button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full py-5 btn-d-purple transition-all duration-300 text-white font-semibold rounded-xl flex justify-center items-center gap-3 cursor-pointer disabled:opacity-50 hover:shadow-xl transform"
                                    >
                                        <Mail  className="w-5 h-5" />
                                        {loading ? (
                                            <span className="flex items-center gap-1">
                                                Enviando
                                                <span className="dot-animate">.</span>
                                                <span className="dot-animate delay-150">.</span>
                                                <span className="dot-animate delay-300">.</span>
                                            </span>
                                        ) : (
                                            "Enviar E-mail"
                                        )}
                                    </Button>
                                    
                                    <div className="text-center">
                                        <p className="text-white/70 text-sm">
                                            Lembrou da senha?{" "}
                                            <Link 
                                                href="/login" 
                                                className="text-purple-300 hover:text-purple-200 underline underline-offset-2 font-medium transition-colors duration-200"
                                            >
                                                Login
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
