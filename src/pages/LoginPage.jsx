import { Icon } from "@iconify/react";
import logo from "../assets/logo.png";
import { useState } from "react";
import {
  useLoginMutate,
  useSignupMutate,
  useResetPasswordMutate,
} from "../stack/LoginStack";
import { Toaster } from "sonner";
import { useForm } from "react-hook-form";

const LoginForm = ({ onGoSignup, onGoReset }) => {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { isPending, mutate } = useLoginMutate();

  return (
    <>
      <h1 className="text-2xl font-medium mb-6 text-center">Iniciar sesión</h1>
      <form onSubmit={handleSubmit(mutate)}>
        <div className="mb-4">
          <input
            placeholder="tucorreo@ejemplo.com"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00aff0]"
            {...register("email", {
              required: "El correo es obligatorio",
              pattern: { value: /^\S+@\S+\.\S+$/, message: "Correo inválido" },
            })}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>
        <div className="relative mb-4">
          <input
            placeholder="Ingresa tu contraseña"
            type={showPassword ? "text" : "password"}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00aff0]"
            {...register("password", {
              required: "La contraseña es obligatoria",
              minLength: { value: 6, message: "Mínimo 6 caracteres" },
            })}
          />
          <button
            type="button"
            className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-500 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            <Icon icon={showPassword ? "mdi:eye-off" : "mdi:eye"} />
          </button>
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">
              {errors.password.message}
            </p>
          )}
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-gray-200 text-gray-500 font-medium py-3 rounded-full hover:bg-[#00AFF0] transition duration-200 cursor-pointer hover:text-white disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isPending ? "Ingresando..." : "Ingresar"}
        </button>
      </form>
      <div className="mt-4 text-xs text-gray-500 text-center">
        Al iniciar sesión y usar LinKer, aceptas nuestros{" "}
        <a href="#" className="text-[#00aff0]">
          Términos de servicio
        </a>{" "}
        y{" "}
        <a href="#" className="text-[#00aff0]">
          Política de privacidad
        </a>
        .
      </div>
      <div className="mt-6 text-center">
        <button
          onClick={onGoReset}
          className="text-[#00aff0] text-sm hover:underline cursor-pointer"
        >
          ¿Has olvidado la contraseña?
        </button>
        <div className="mt-1">
          <button
            onClick={onGoSignup}
            className="text-[#00aff0] text-sm hover:underline cursor-pointer"
          >
            Regístrate en LinKer
          </button>
        </div>
      </div>
    </>
  );
};

const SignupForm = ({ onGoLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false); // ← nuevo
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const { isPending, mutate } = useSignupMutate();

  return (
    <>
      <h1 className="text-2xl font-medium mb-6 text-center">Crear cuenta</h1>
      <form onSubmit={handleSubmit(mutate)}>
        <div className="mb-4">
          <input
            placeholder="tucorreo@ejemplo.com"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00aff0]"
            {...register("email", {
              required: "El correo es obligatorio",
              pattern: { value: /^\S+@\S+\.\S+$/, message: "Correo inválido" },
            })}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>
        <div className="relative mb-4">
          <input
            placeholder="Crea una contraseña"
            type={showPassword ? "text" : "password"}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00aff0]"
            {...register("password", {
              required: "La contraseña es obligatoria",
              minLength: { value: 6, message: "Mínimo 6 caracteres" },
            })}
          />
          <button
            type="button"
            className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-500 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            <Icon icon={showPassword ? "mdi:eye-off" : "mdi:eye"} />
          </button>
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">
              {errors.password.message}
            </p>
          )}
        </div>
        <div className="relative mb-4">
          <input
            placeholder="Confirma tu contraseña"
            type={showConfirm ? "text" : "password"} // ← usa showConfirm
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00aff0]"
            {...register("confirm", {
              required: "Confirma tu contraseña",
              validate: (val) =>
                val === watch("password") || "Las contraseñas no coinciden",
            })}
          />
          <button
            type="button"
            className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-500 cursor-pointer"
            onClick={() => setShowConfirm(!showConfirm)} // ← toggle independiente
          >
            <Icon icon={showConfirm ? "mdi:eye-off" : "mdi:eye"} />
          </button>
          {errors.confirm && (
            <p className="text-red-500 text-xs mt-1">
              {errors.confirm.message}
            </p>
          )}
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-gray-200 text-gray-500 font-medium py-3 rounded-full hover:bg-[#00AFF0] transition duration-200 cursor-pointer hover:text-white disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isPending ? "Creando cuenta..." : "Registrarse"}
        </button>
      </form>
      <div className="mt-6 text-center">
        <button
          onClick={onGoLogin}
          className="text-[#00aff0] text-sm hover:underline cursor-pointer"
        >
          ¿Ya tienes cuenta? Inicia sesión
        </button>
      </div>
    </>
  );
};

const ResetForm = ({ onGoLogin }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { isPending, mutate, isSuccess } = useResetPasswordMutate();

  return (
    <>
      <h1 className="text-2xl font-medium mb-2 text-center">
        Recuperar contraseña
      </h1>
      <p className="text-gray-500 text-sm text-center mb-6">
        Te enviaremos un enlace a tu correo para restablecer la contraseña.
      </p>
      {isSuccess ? (
        <div className="text-center text-green-600 font-medium py-4">
          ✅ Correo enviado. Revisa tu bandeja de entrada y spam.
        </div>
      ) : (
        <form onSubmit={handleSubmit(mutate)}>
          <div className="mb-4">
            <input
              placeholder="tucorreo@ejemplo.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00aff0]"
              {...register("email", {
                required: "El correo es obligatorio",
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: "Correo inválido",
                },
              })}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-gray-200 text-gray-500 font-medium py-3 rounded-full hover:bg-[#00AFF0] transition duration-200 cursor-pointer hover:text-white disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isPending ? "Enviando..." : "Enviar enlace"}
          </button>
        </form>
      )}
      <div className="mt-6 text-center">
        <button
          onClick={onGoLogin}
          className="text-[#00aff0] text-sm hover:underline cursor-pointer"
        >
          ← Volver al login
        </button>
      </div>
    </>
  );
};

export const LoginPage = () => {
  const [view, setView] = useState("login");

  return (
    <main className="flex h-screen w-full">
      <Toaster />
      <section className="hidden md:flex md:w-1/2 bg-[#00b0f0] flex-col justify-center items-center overflow-hidden">
        <div className="px-8 text-white text-center flex flex-col gap-4">
          <div className="flex items-center gap-3 justify-center">
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
          {view === "login" && (
            <LoginForm
              onGoSignup={() => setView("signup")}
              onGoReset={() => setView("reset")}
            />
          )}
          {view === "signup" && (
            <SignupForm onGoLogin={() => setView("login")} />
          )}
          {view === "reset" && <ResetForm onGoLogin={() => setView("login")} />}
        </div>
      </section>
    </main>
  );
};
