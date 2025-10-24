import logo from "../assets/logo.png";

export const LoginPage = () => {
  return (
    <div className="flex h-screen w-full">
      <section className="bg-[#00b0f0] flex flex-col justify-center items-center overflow-hidden">
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
      <section></section>
    </div>
  );
};
