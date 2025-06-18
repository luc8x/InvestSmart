"use client";
import { useState } from "react";
import Image from "next/image";
import Alert from "@/components/alert";

import {
  User,
  CircleUserRound,
  DoorOpen,
  AtSign,
  Eye,
  EyeOff,
  Calendar as CalendarIcon,
} from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { registerUser } from "@/utils/usersServices";

export default function LoginPage() {
  const [cpf, setCpf] = useState("");
  const [nome_completo, setNomeCompleto] = useState("");
  const [dataNascimento, setDataNascimento] = useState<Date>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    
    if(cpf==="" || email==="" || dataNascimento===undefined || nome_completo==="" || password==="") {
      return
    }
    
    try{
      const dataNascimento_f = new Date(dataNascimento).toISOString().split('T')[0]; 
      await registerUser(cpf, email, dataNascimento_f, nome_completo, password);
      window.location.href = "/painel";
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      {error && (
        <Alert message={error} type="error" onClose={() => setError("")} />
      )}
      <div className="mx-auto max-w-[1100px] rounded-3xl border border-purple/70 shadow-lg border-purple-800 card-bg-d-purple-2">
        <div className="grid grid-cols-1 md:grid-cols-2 h-full overflow-hidden rounded-3xl">
          <div className="hidden md:block">
            <Image
              src="/img/tinta(1).jpg"
              alt="Imagem decorativa de tinta"
              width={600}
              height={550}
              className="h-full w-full object-cover rounded-l-3xl"
            />
          </div>

          <div className="p-8 flex flex-col justify-center gap-6">
            <div>
              <h1 className="text-2xl font-bold text-white">
                Bem-vindo ao ####!
                <br />
                Cadastre sua conta
              </h1>
            </div>

            <form
              className="flex flex-col gap-4 p-6 rounded-xl shadow-lg border border-white/30 backdrop-blur bg-white/10"
              onSubmit={handleSubmit}
            >
              <div>
                <div className="flex justify-between">
                  <p className="font-semibold text-white mb-2">
                    Informe os dados abaixo
                  </p>
                  <a
                    href="/login"
                    className="text-white font-semibold flex items-center gap-2 cursor-pointer text-sm"
                  >
                    <DoorOpen size={20} />
                    Login
                  </a>
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="nome_completo"
                    className="text-white block mb-1"
                  >
                    Nome completo
                  </label>
                  <div className="flex items-center shadow-sm bg-transparent border border-white/70 rounded-lg">
                    <input
                      type="text"
                      id="nome_completo"
                      name="nome_completo"
                      value={nome_completo}
                      onChange={(e) => setNomeCompleto(e.target.value)}
                      className="flex-1 bg-transparent text-white placeholder-white/70 focus:outline-none py-2 px-3 pr-0 rounded-l-lg"
                      placeholder="Digite seu nome completo"
                      required
                    />
                    <User className="text-white w-10 h-5" />
                  </div>
                </div>

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
                    <CircleUserRound className="text-white w-10 h-5" />
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="dataNascimento" className="text-white block mb-1">
                    Data de nascimento
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                        <Button
                        variant={"outline"}
                        className={cn(
                            "w-[280px] justify-start text-left font-normal",
                            !dataNascimento && "text-muted-foreground"
                        )}
                        >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dataNascimento ? format(dataNascimento, "dd/MM/yyyy") : <span>Selecione uma data</span>}
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
                        />
                    </PopoverContent>
                    </Popover>
                  <input
                    type="hidden"
                    name="dataNascimento"
                    value={dataNascimento ? format(dataNascimento, "yyyy-MM-dd") : ""}
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="email" className="text-white block mb-1">
                    Email
                  </label>
                  <div className="flex items-center shadow-sm bg-transparent border border-white/70 rounded-lg">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-1 bg-transparent text-white placeholder-white/70 focus:outline-none py-2 px-3 pr-0 rounded-l-lg"
                      placeholder="Digite seu email"
                      required
                    />
                    <AtSign className="text-white w-10 h-5" />
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

              <div className="text-white text-sm">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2 btn-d-purple transition-colors text-white font-semibold rounded-lg flex justify-center items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <User />
                  {loading ? (
                    <span className="flex items-center gap-1">
                      Carregando
                      <span className="dot-animate">.</span>
                      <span className="dot-animate delay-150">.</span>
                      <span className="dot-animate delay-300">.</span>
                    </span>
                  ) : (
                    "Cadastre-se"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
