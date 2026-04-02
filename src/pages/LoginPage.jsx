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

const InputField = ({ placeholder, type = "text", icon, error, ...rest }) => (
  <div>
    <div className="relative">
      <Icon
        icon={icon}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg"
      />
      <input
        placeholder={placeholder}
        type={type}
        className="w-full pl-11 pr-4 py-3.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder-gray-400"
        {...rest}
      />
    </div>
    {error && <p className="text-red-500 text-xs mt-1.5 ml-1">{error}</p>}
  </div>
);

const PasswordField = ({ placeholder, error, register: reg }) => {
  const [show, setShow] = useState(false);
  return (
    <div>
      <div className="relative">
        <Icon
          icon="mdi:lock-outline"
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg"
        />
        <input
          placeholder={placeholder}
          type={show ? "text" : "password"}
          className="w-full pl-11 pr-11 py-3.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder-gray-400"
          {...reg}
        />
        <button
          type="button"
          className="absolute top-1/2 -translate-y-1/2 right-3.5 text-gray-400 hover:text-gray-600 cursor-pointer transition-colors"
          onClick={() => setShow(!show)}
          aria-label={show ? "Ocultar contraseña" : "Mostrar contraseña"}
        >
          <Icon icon={show ? "mdi:eye-off-outline" : "mdi:eye-outline"} className="text-lg" />
        </button>
      </div>
      {error && <p className="text-red-500 text-xs mt-1.5 ml-1">{error}</p>}
    </div>
  );
};

const SubmitButton = ({ isPending, label, loadingLabel }) => (
  <button
    type="submit"
    disabled={isPending}
    className="w-full bg-primary text-white font-semibold py-3.5 rounded-xl hover:bg-primary/90 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-primary/25"
  >
    {isPending ? loadingLabel : label}
  </button>
);

const LoginForm = ({ onGoSignup, onGoReset }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { isPending, mutate } = useLoginMutate();

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">Bienvenido de vuelta</h1>
        <p className="text-gray-500 text-sm">Inicia sesión en tu cuenta</p>
      </div>

      <form onSubmit={handleSubmit(mutate)} className="space-y-4">
        <InputField
          placeholder="tucorreo@ejemplo.com"
          icon="mdi:email-outline"
          error={errors.email?.message}
          {...register("email", {
            required: "El correo es obligatorio",
            pattern: { value: /^\S+@\S+\.\S+$/, message: "Correo inválido" },
          })}
        />
        <PasswordField
          placeholder="Tu contraseña"
          error={errors.password?.message}
          register={register("password", {
            required: "La contraseña es obligatoria",
            minLength: { value: 6, message: "Mínimo 6 caracteres" },
          })}
        />

        <div className="flex justify-end">
          <button
            type="button"
            onClick={onGoReset}
            className="text-primary text-xs font-medium hover:underline cursor-pointer"
          >
            ¿Olvidaste tu contraseña?
          </button>
        </div>

        <SubmitButton
          isPending={isPending}
          label="Iniciar sesión"
          loadingLabel="Ingresando..."
        />
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200 dark:border-neutral-700" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-white dark:bg-bg-dark px-4 text-gray-400">o</span>
        </div>
      </div>

      <button
        onClick={onGoSignup}
        className="w-full py-3.5 rounded-xl border-2 border-primary text-primary font-semibold text-sm hover:bg-primary hover:text-white transition-all cursor-pointer"
      >
        Crear una cuenta
      </button>

      <p className="text-[11px] text-gray-400 text-center leading-relaxed">
        Al continuar, aceptas los{" "}
        <a href="#" className="text-primary hover:underline">Términos de servicio</a>{" "}
        y la{" "}
        <a href="#" className="text-primary hover:underline">Política de privacidad</a>.
      </p>
    </div>
  );
};

const SignupForm = ({ onGoLogin }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const { isPending, mutate } = useSignupMutate();

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">Crea tu cuenta</h1>
        <p className="text-gray-500 text-sm">Únete a la comunidad de LinKer</p>
      </div>

      <form onSubmit={handleSubmit(mutate)} className="space-y-4">
        <InputField
          placeholder="tucorreo@ejemplo.com"
          icon="mdi:email-outline"
          error={errors.email?.message}
          {...register("email", {
            required: "El correo es obligatorio",
            pattern: { value: /^\S+@\S+\.\S+$/, message: "Correo inválido" },
          })}
        />
        <PasswordField
          placeholder="Crea una contraseña"
          error={errors.password?.message}
          register={register("password", {
            required: "La contraseña es obligatoria",
            minLength: { value: 6, message: "Mínimo 6 caracteres" },
          })}
        />
        <PasswordField
          placeholder="Confirma tu contraseña"
          error={errors.confirm?.message}
          register={register("confirm", {
            required: "Confirma tu contraseña",
            validate: (val) =>
              val === watch("password") || "Las contraseñas no coinciden",
          })}
        />

        <SubmitButton
          isPending={isPending}
          label="Registrarse"
          loadingLabel="Creando cuenta..."
        />
      </form>

      <p className="text-center text-sm text-gray-500">
        ¿Ya tienes cuenta?{" "}
        <button
          onClick={onGoLogin}
          className="text-primary font-semibold hover:underline cursor-pointer"
        >
          Inicia sesión
        </button>
      </p>
    </div>
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
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-2">
          <Icon icon="mdi:lock-reset" className="text-3xl text-primary" />
        </div>
        <h1 className="text-2xl font-bold">Recuperar contraseña</h1>
        <p className="text-gray-500 text-sm">
          Te enviaremos un enlace para restablecer tu contraseña.
        </p>
      </div>

      {isSuccess ? (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 text-center">
          <Icon icon="mdi:check-circle" className="text-green-500 text-3xl mx-auto mb-2" />
          <p className="text-green-700 dark:text-green-400 font-medium text-sm">
            Correo enviado exitosamente
          </p>
          <p className="text-green-600 dark:text-green-500 text-xs mt-1">
            Revisa tu bandeja de entrada y spam.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(mutate)} className="space-y-4">
          <InputField
            placeholder="tucorreo@ejemplo.com"
            icon="mdi:email-outline"
            error={errors.email?.message}
            {...register("email", {
              required: "El correo es obligatorio",
              pattern: {
                value: /^\S+@\S+\.\S+$/,
                message: "Correo inválido",
              },
            })}
          />

          <SubmitButton
            isPending={isPending}
            label="Enviar enlace"
            loadingLabel="Enviando..."
          />
        </form>
      )}

      <button
        onClick={onGoLogin}
        className="flex items-center gap-1 text-primary text-sm font-medium hover:underline cursor-pointer mx-auto"
      >
        <Icon icon="mdi:arrow-left" className="text-base" />
        Volver al inicio de sesión
      </button>
    </div>
  );
};

export const LoginPage = () => {
  const [view, setView] = useState("login");

  return (
    <main className="flex h-screen w-full bg-white dark:bg-bg-dark text-black dark:text-white">
      <Toaster />

      {/* Panel izquierdo */}
      <section className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-primary via-[#0091EA] to-[#00B8D4] flex-col justify-center items-center relative overflow-hidden">
        {/* Decoración de fondo */}
        <div className="absolute top-20 -left-20 w-72 h-72 bg-white/5 rounded-full" />
        <div className="absolute bottom-20 -right-10 w-56 h-56 bg-white/5 rounded-full" />
        <div className="absolute top-1/2 left-1/3 w-40 h-40 bg-white/5 rounded-full" />

        <div className="relative z-10 px-12 text-white text-center flex flex-col items-center gap-8">
          <div className="flex items-center gap-4">
            <img src={logo} alt="LinKer logo" className="h-14 w-14 drop-shadow-lg" />
            <span className="text-5xl font-bold tracking-tight">
              Lin<span className="text-white/80">Ker</span>
            </span>
          </div>
          <div className="space-y-2 max-w-sm">
            <p className="text-2xl font-semibold leading-snug">
              Conecta, comparte y descubre contenido increíble
            </p>
            <p className="text-white/70 text-base">
              Únete a una comunidad donde tus ideas importan.
            </p>
          </div>

          {/* Features */}
          <div className="flex flex-col gap-4 mt-4">
            <div className="flex items-center gap-3 text-white/90 text-sm">
              <div className="w-8 h-8 bg-white/15 rounded-lg flex items-center justify-center shrink-0">
                <Icon icon="mdi:account-group" className="text-lg" />
              </div>
              <span>Sigue a creadores y construye tu comunidad</span>
            </div>
            <div className="flex items-center gap-3 text-white/90 text-sm">
              <div className="w-8 h-8 bg-white/15 rounded-lg flex items-center justify-center shrink-0">
                <Icon icon="mdi:message-text" className="text-lg" />
              </div>
              <span>Chatea en tiempo real con tus seguidores</span>
            </div>
            <div className="flex items-center gap-3 text-white/90 text-sm">
              <div className="w-8 h-8 bg-white/15 rounded-lg flex items-center justify-center shrink-0">
                <Icon icon="mdi:bookmark-multiple" className="text-lg" />
              </div>
              <span>Guarda y organiza tu contenido favorito</span>
            </div>
          </div>
        </div>
      </section>

      {/* Panel derecho */}
      <section className="w-full lg:w-1/2 flex items-center justify-center px-6 md:px-16 py-8">
        <div className="w-full max-w-sm">
          {/* Logo móvil */}
          <div className="lg:hidden flex items-center gap-3 justify-center mb-10">
            <img src={logo} alt="LinKer logo" className="h-10 w-10" />
            <span className="text-3xl font-bold text-primary">
              Lin<span className="text-gray-800 dark:text-white">Ker</span>
            </span>
          </div>

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
