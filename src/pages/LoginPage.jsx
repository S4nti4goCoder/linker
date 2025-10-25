import { Icon } from "@iconify/react";
import logo from "../assets/logo.png";
import { useEffect, useState } from "react";
import { useGenerarCodigosAleatorios } from "../hooks/useGenerarCodigosAleatorios";
import { useAuthStore } from "../store/AuthStore";
import { useCrearUsuarioYSesionMutate } from "../stack/LoginStack";
import { Toaster } from "sonner";
import { useForm } from "react-hook-form";

export const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { setCredenciales } = useAuthStore();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const { handleSubmit } = useForm();
  const { isPending, mutate } = useCrearUsuarioYSesionMutate();
  useEffect(() => {
    const response = useGenerarCodigosAleatorios();
    const correoCompleto = response + "@gmail.com";
    setCredenciales({ email: correoCompleto, password: response });
    setEmail(correoCompleto);
    setPassword(response);
  }, []);
  return (
    <main className="flex h-screen w-full">
      <Toaster />
      <section className="hidden md:flex md:w-1/2 bg-[#00b0f0] flex-col justify-center items-center overflow-hidden">
        <div className="px-8 text-white text-center flex flex-col gap-4">
          <div className="flex  items-center gap-3 justify-center">
            <img src={logo} className="h-10 w-10" />
            <span className="text-4xl font-bold text-[#CCEFFC]">
              Lin<span className="text-[#ffffff]">Ker</span>
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-3xl font-semibold">
              Registrate para apoyar
            </span>
            <span className="text-3xl font-semibold">a tus creadores </span>
            <span className="text-3xl font-bold">favoritos</span>
          </div>
        </div>
      </section>
      <section className="w-full md:w-1/2 flex items-center justify-center px-6 md:px-16 py-8">
        <div className="w-full max-w-md">
          <h1 className="text-2xl font-medium mb-6 text-center">
            Iniciar sesión{" "}
            <span className="text-[#0091EA] text-xl">(modo invitado)</span>
          </h1>
          <form onSubmit={handleSubmit(mutate)}>
            <div className="mb-4">
              <input
                placeholder="tucorreo@ejemplo.com"
                value={email}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00aff0]"
              />
            </div>
            <div className="relative mb-4">
              <input
                placeholder="Ingresa la contraseña"
                value={password}
                type={showPassword ? "text" : "password"}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00aff0]"
              />
              <button
                type="button"
                className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-500 cursor-pointer"
                onClick={togglePasswordVisibility}
              >
                <Icon icon={showPassword ? "mdi:eye-off" : "mdi:eye"} />
              </button>
            </div>
            <button
              type="submit"
              className="w-full bg-gray-200 text-gray-500 font-medium py-3 rounded-full hover:bg-[#00AFF0] transition duration-200 cursor-pointer hover:text-white"
              disabled={isPending}
            >
              Ingresar
            </button>
          </form>
          <div className="mt-4 text-xs text-gray-500 text-center">
            Al iniciar sesión y usar LinKer, aceptar nuestros{"  "}
            <a href="#" className="text-[#00aff0]">
              Términos de servicio
            </a>{" "}
            y{"  "}
            <a href="#" className="text-[#00aff0]">
              Política de privacidad
            </a>
            {"  "}y confirmas que tienes al menos 18 años.
          </div>
          <div className="mt-6 text-center">
            <a href="#" className="text-[#00aff0] text-sm">
              ¿Has olvidado la contraseña?
            </a>
            <div className="mt-1">
              <a href="#" className="text-[#00aff0] text-sm">
                Registrate para LinKer
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};
