import { useMostrarUsuarioAuthQuery } from "../stack/UsuariosStack";
import { useUsuariosStore } from "../store/UsuariosStore";

export const MiPerfilPage = () => {
  const { dataUsuarioAuth } = useUsuariosStore();
  return (
    <div className="h-screen bg-amber-300 text-black">
      <span>MiPerfilPage</span>
      <span> Usuario: {dataUsuarioAuth?.nombre} </span>
    </div>
  );
};
