import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";

const TerminosPage = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-bg-dark text-gray-800 dark:text-gray-200">
      <header className="border-b border-gray-200 dark:border-neutral-700 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link to="/login" className="flex items-center gap-2 text-primary hover:opacity-80 transition-opacity">
            <Icon icon="mdi:arrow-left" className="text-xl" />
            <span className="text-sm font-medium">Volver</span>
          </Link>
          <h1 className="text-lg font-bold">Términos y Condiciones</h1>
          <div className="w-16" />
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8 space-y-8">
        <div className="space-y-2">
          <p className="text-sm text-gray-500">Última actualización: abril 2026</p>
          <p className="text-sm leading-relaxed">
            Bienvenido a LinKer. Al acceder y utilizar nuestra plataforma, aceptas los siguientes términos y condiciones. Si no estás de acuerdo, te pedimos que no utilices el servicio.
          </p>
        </div>

        <section className="space-y-3">
          <h2 className="text-base font-bold">1. Descripción del servicio</h2>
          <p className="text-sm leading-relaxed">
            LinKer es una red social que permite a los usuarios crear perfiles, publicar contenido (texto, imágenes y videos), interactuar con otros usuarios mediante comentarios, likes y mensajes directos, y seguir a otros miembros de la comunidad.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold">2. Registro y cuenta</h2>
          <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
            <li>Debes proporcionar información veraz y actualizada al registrarte.</li>
            <li>Eres responsable de mantener la confidencialidad de tu contraseña.</li>
            <li>No puedes crear cuentas con identidades falsas o suplantando a terceros.</li>
            <li>Debes tener al menos 13 años para usar la plataforma.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold">3. Contenido del usuario</h2>
          <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
            <li>Eres el único responsable del contenido que publicas.</li>
            <li>Al publicar contenido, otorgas a LinKer una licencia no exclusiva para mostrarlo dentro de la plataforma.</li>
            <li>No está permitido publicar contenido ilegal, ofensivo, difamatorio, que incite al odio o que viole derechos de terceros.</li>
            <li>LinKer se reserva el derecho de eliminar contenido que viole estas normas sin previo aviso.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold">4. Conducta del usuario</h2>
          <p className="text-sm leading-relaxed">No está permitido:</p>
          <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
            <li>Acosar, intimidar o amenazar a otros usuarios.</li>
            <li>Enviar spam o contenido no solicitado.</li>
            <li>Intentar acceder a cuentas ajenas.</li>
            <li>Usar bots o herramientas automatizadas sin autorización.</li>
            <li>Interferir con el funcionamiento de la plataforma.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold">5. Mensajes directos</h2>
          <p className="text-sm leading-relaxed">
            La función de mensajes está disponible entre usuarios que se siguen mutuamente. Los mensajes son privados entre los participantes de la conversación. LinKer no se responsabiliza por el contenido intercambiado en mensajes privados.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold">6. Propiedad intelectual</h2>
          <p className="text-sm leading-relaxed">
            El diseño, código, marca y elementos visuales de LinKer son propiedad de su creador. No se permite copiar, modificar o distribuir estos elementos sin autorización expresa.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold">7. Suspensión y terminación</h2>
          <p className="text-sm leading-relaxed">
            LinKer se reserva el derecho de suspender o eliminar cuentas que violen estos términos, sin previo aviso y a su entera discreción.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold">8. Limitación de responsabilidad</h2>
          <p className="text-sm leading-relaxed">
            LinKer se proporciona "tal cual" sin garantías de ningún tipo. No nos hacemos responsables por pérdida de datos, interrupciones del servicio o daños derivados del uso de la plataforma.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold">9. Modificaciones</h2>
          <p className="text-sm leading-relaxed">
            Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios serán efectivos desde su publicación. El uso continuado de la plataforma implica la aceptación de los términos actualizados.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold">10. Contacto</h2>
          <p className="text-sm leading-relaxed">
            Si tienes preguntas sobre estos términos, puedes contactarnos a través de la plataforma.
          </p>
        </section>

        <div className="border-t border-gray-200 dark:border-neutral-700 pt-6">
          <Link to="/privacidad" className="text-primary text-sm font-medium hover:underline">
            Ver Política de Privacidad
          </Link>
        </div>
      </main>
    </div>
  );
};

export default TerminosPage;
