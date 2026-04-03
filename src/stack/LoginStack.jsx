import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "../store/AuthStore";
import { toast } from "sonner";

export const useLoginMutate = () => {
  const { iniciarSesion } = useAuthStore();
  return useMutation({
    mutationKey: ["login"],
    mutationFn: (data) =>
      iniciarSesion({ email: data.email, password: data.password }),
    onError: (error) => {
      const msg = error.message;
      if (msg.includes("Invalid login credentials"))
        return toast.error("Correo o contraseña incorrectos");
      if (msg.includes("Email not confirmed"))
        return toast.error("Debes confirmar tu correo antes de ingresar");
      toast.error("Error al iniciar sesión. Intenta de nuevo.");
    },
    onSuccess: () => toast.success("¡Bienvenido de nuevo!"),
  });
};

export const useSignupMutate = () => {
  const { crearCuenta } = useAuthStore();
  return useMutation({
    mutationKey: ["signup"],
    mutationFn: (data) =>
      crearCuenta({ email: data.email, password: data.password }),
    onError: (error) => {
      const msg = error.message;
      if (msg.includes("User already registered"))
        return toast.error("Este correo ya tiene una cuenta. Inicia sesión.");
      if (msg.includes("Password should be at least"))
        return toast.error("La contraseña debe tener al menos 6 caracteres");
      toast.error("Error al registrarse. Intenta de nuevo.");
    },
    onSuccess: () =>
      toast.success("¡Cuenta creada exitosamente! Ya puedes ingresar."),
  });
};

export const useResetPasswordMutate = () => {
  const { resetPassword } = useAuthStore();
  return useMutation({
    mutationKey: ["reset-password"],
    mutationFn: (data) => resetPassword(data.email),
    onError: (error) => {
      toast.error(
        "No pudimos enviar el correo. Verifica la dirección e intenta de nuevo.",
      );
    },
    onSuccess: () =>
      toast.success("¡Correo enviado! Revisa tu bandeja de entrada (y spam)."),
  });
};
