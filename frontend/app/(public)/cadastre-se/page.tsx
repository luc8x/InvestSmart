"use client";
import { useState } from "react";
import { User, AtSign, Eye, EyeOff, Calendar as CalendarIcon, UserCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { registerUser } from "@/utils/usersServices";
import Alert from "@/components/alert";
import Link from "next/link";

export default function LoginPage() {
  const [cpf, setCpf] = useState("");
  const [nome_completo, setNomeCompleto] = useState("");
  const [dataNascimento, setDataNascimento] = useState<Date>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!cpf || !email || !dataNascimento || !nome_completo || !password) {
      setError("Todos os campos são obrigatórios");
      setLoading(false);
      return;
    }

    try {
      const dataNascimento_f = new Date(dataNascimento).toISOString().split('T')[0];

      const cpfLimpo = cpf.replace(/\D/g, "");

      await registerUser(cpfLimpo, email, dataNascimento_f, nome_completo, password);
      window.location.href = "/painel";
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      {error && <Alert message={error} type="error" onClose={() => setError("")} />}
      <div className="mx-auto max-w-[1200px] w-full rounded-3xl border border-purple-200/30 shadow-2xl card-bg-d-purple backdrop-blur-sm">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px] overflow-hidden rounded-3xl">
          <div className="hidden lg:block relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-blue-600/20 z-10"></div>
            <img
              src="/gif/tinta_2.gif"
              alt="Efeito de tinta"
              width={600}
              height={600}
              className="h-full w-full object-cover rounded-l-3xl transition-transform duration-700"
            />

            <div className="absolute bottom-12 left-8 right-8 z-20">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <h3 className="text-white font-semibold text-lg mb-2">Bem-vindo ao InvestSmart</h3>
                <p className="text-white/80 text-sm">
                  Crie sua conta e dê o primeiro passo rumo a uma gestão financeira mais inteligente.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 min-h-[600px] overflow-hidden rounded-3xl">
            <div className="p-8 lg:p-12 flex flex-col justify-center gap-8 relative">
              <div className="space-y-2">
                <h1 className="text-3xl lg:text-4xl font-bold text-white leading-tight">
                  Bem-vindo ao InvestSmart
                </h1>
                <p className="text-purple-200/80 text-lg">
                  Cadastre sua conta para começar
                </p>
              </div>

              <form
                className="flex flex-col gap-6 p-8 rounded-2xl shadow-2xl border border-white/20 backdrop-blur-md bg-white/5 hover:bg-white/10 transition-all duration-300"
                onSubmit={handleSubmit}
              >
                <div className="space-y-6">
                  <div className="text-center">
                    <p className="font-semibold text-white/90 text-lg">
                      Informe seus dados
                    </p>
                    <div className="w-16 h-0.5 bg-gradient-to-r from-purple-400 to-blue-400 mx-auto mt-2"></div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="nome_completo" className="text-white/90 block text-sm font-medium">
                      Nome Completo
                    </label>
                    <div className="group relative">
                      <div className="flex items-center bg-white/5 border border-white/30 rounded-xl hover:border-white/50 focus-within:border-purple-400 focus-within:bg-white/10 transition-all duration-300">
                        <input
                          type="text"
                          id="nome_completo"
                          name="nome_completo"
                          value={nome_completo}
                          onChange={(e) => setNomeCompleto(e.target.value)}
                          className="flex-1 bg-transparent input:bg-transparent text-white placeholder-white/50 focus:outline-none py-2 px-4 rounded-xl"
                          placeholder="Digite seu nome completo"
                          required
                        />
                        <User className="text-white/60 w-5 h-5 mr-3 group-focus-within:text-purple-400 transition-colors" />
                      </div>
                    </div>
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
                            // só permite números
                            const numeros = e.target.value.replace(/\D/g, "");
                            // aplica máscara
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
                    <label htmlFor="email" className="text-white/90 block text-sm font-medium">
                      E-mail
                    </label>
                    <div className="group relative">
                      <div className="flex items-center bg-white/5 border border-white/30 rounded-xl hover:border-white/50 focus-within:border-purple-400 focus-within:bg-white/10 transition-all duration-300">
                        <input
                          type="text"
                          id="email"
                          name="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="flex-1 bg-transparent input:bg-transparent text-white placeholder-white/50 focus:outline-none py-2 px-4 rounded-xl"
                          placeholder="Digite seu e-mail"
                          required
                        />
                        <AtSign className="text-white/60 w-5 h-5 mr-3 group-focus-within:text-purple-400 transition-colors" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="text-white/90 block text-sm font-medium">
                      Data de Nascimento
                    </label>
                    <div className="group relative">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-10 justify-start text-left font-normal border-white/20 hover:bg-white/10 hover:text-white flex-1 bg-white/5 text-white placeholder-white/50 focus:outline-none py-5 px-4 rounded-xl",
                              !dataNascimento && "text-white/50"
                            )}
                          >
                            <span style={{ fontSize: 16 }}>{dataNascimento ? format(dataNascimento, "dd/MM/yyyy") : <span>Selecione uma data</span>}</span>
                            <CalendarIcon className="absolute right-3 h-5 w-5 text-white/70" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={dataNascimento}
                            onSelect={setDataNascimento}
                            initialFocus
                            captionLayout="dropdown"
                            fromYear={1960}
                            toYear={new Date().getFullYear()}
                            className="rounded-md border"
                          />
                        </PopoverContent>
                      </Popover>
                      <input
                        type="hidden"
                        name="dataNascimento"
                        value={dataNascimento ? format(dataNascimento, "yyyy-MM-dd") : ""}
                      />
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

                <div className="space-y-4">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full py-5 btn-d-purple transition-all duration-300 text-white font-semibold rounded-xl flex justify-center items-center gap-3 cursor-pointer disabled:opacity-50 hover:shadow-xl transform"
                  >
                    <UserCircle className="w-5 h-5" />
                    {loading ? (
                      <span className="flex items-center gap-1">
                        Entrando
                        <span className="dot-animate">.</span>
                        <span className="dot-animate delay-150">.</span>
                        <span className="dot-animate delay-300">.</span>
                      </span>
                    ) : (
                      "Cadastrar-se"
                    )}
                  </Button>

                  <div className="text-center">
                    <p className="text-white/70 text-sm">
                      Já tem conta?{" "}
                      <Link
                        href="/login"
                        className="text-purple-300 hover:text-purple-200 underline underline-offset-2 font-medium transition-colors duration-200"
                      >
                        Login
                      </Link>
                    </p>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
