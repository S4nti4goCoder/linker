import { useMostrarUsuarioAuthQuery } from "../stack/UsuariosStack";

export const MiPerfilPage = () => {
  const { data, isLoading, error } = useMostrarUsuarioAuthQuery();
  if (isLoading) {
    return <span>Cargando data...</span>;
  }
  if (error) {
    return <span>Error al cargar usuarios... {error.message} </span>;
  }
  return (
    <div className="h-screen bg-amber-300 text-black">
      <span>MiPerfilPage</span>
      <span> Usuario: {data?.nombre} </span>
    </div>
  );
};
