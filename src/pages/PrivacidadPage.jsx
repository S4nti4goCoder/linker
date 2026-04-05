import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";

const PrivacidadPage = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-bg-dark text-gray-800 dark:text-gray-200">
      <header className="border-b border-gray-200 dark:border-neutral-700 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link to="/login" className="flex items-center gap-2 text-primary hover:opacity-80 transition-opacity">
            <Icon icon="mdi:arrow-left" className="text-xl" />
            <span className="text-sm font-medium">Volver</span>
          </Link>
          <h1 className="text-lg font-bold">Política de Privacidad</h1>
          <div className="w-16" />
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8 space-y-8">
        <div className="space-y-2">
          <p className="text-sm text-gray-500">Última actualización: abril 2026</p>
          <p className="text-sm leading-relaxed">
            En LinKer nos tomamos en serio tu privacidad. Esta política describe qué información recopilamos, cómo la usamos y cómo la protegemos.
          </p>
        </div>

        <section className="space-y-3">
          <h2 className="text-base font-bold">1. Información que recopilamos</h2>
          <p className="text-sm leading-relaxed font-medium">Información que proporcionas directamente:</p>
          <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
            <li>Nombre, correo electrónico y contraseña al registrarte.</li>
            <li>Foto de perfil, banner y biografía que agregues a tu perfil.</li>
            <li>Publicaciones, comentarios, mensajes y demás contenido que crees.</li>
            <li>Enlaces a redes sociales (Instagram, Twitter, sitio web) si los proporcionas.</li>
          </ul>
          <p className="text-sm leading-relaxed font-medium mt-3">Información recopilada automáticamente:</p>
          <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
            <li>Fecha y hora de tu último acceso para mostrar tu estado de conexión.</li>
            <li>Información básica del navegador para mejorar la experiencia.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold">2. Cómo usamos tu información</h2>
          <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
            <li>Para crear y gestionar tu cuenta.</li>
            <li>Para mostrar tu perfil y contenido a otros usuarios.</li>
            <li>Para permitir la comunicación entre usuarios (mensajes, comentarios, notificaciones).</li>
            <li>Para mostrar tu estado de conexión a otros usuarios en la sección de mensajes.</li>
            <li>Para mejorar y mantener el funcionamiento de la plataforma.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold">3. Compartición de datos</h2>
          <p className="text-sm leading-relaxed">
            No vendemos, alquilamos ni compartimos tu información personal con terceros con fines comerciales. Tu información solo es visible dentro de la plataforma según la configuración de tu perfil.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold">4. Autenticación con terceros</h2>
          <p className="text-sm leading-relaxed">
            Si inicias sesión con Google, recibimos tu nombre y correo electrónico de tu cuenta de Google. No accedemos a ningún otro dato de tu cuenta de Google. Este proceso es gestionado de forma segura a través de Supabase Auth.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold">5. Almacenamiento y seguridad</h2>
          <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
            <li>Tus datos se almacenan en servidores seguros proporcionados por Supabase.</li>
            <li>Las contraseñas se almacenan de forma encriptada y nunca son visibles en texto plano.</li>
            <li>Utilizamos políticas de seguridad a nivel de base de datos (RLS) para proteger el acceso a la información.</li>
            <li>Los archivos (imágenes y videos) se almacenan en un servicio de almacenamiento seguro.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold">6. Tus derechos</h2>
          <p className="text-sm leading-relaxed">Tienes derecho a:</p>
          <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
            <li>Acceder a tu información personal desde tu perfil.</li>
            <li>Modificar o actualizar tus datos en cualquier momento.</li>
            <li>Solicitar la eliminación de tu cuenta y datos asociados.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold">7. Cookies</h2>
          <p className="text-sm leading-relaxed">
            LinKer utiliza almacenamiento local del navegador para mantener tu sesión activa y guardar tus preferencias (como el tema oscuro/claro). No utilizamos cookies de rastreo ni de publicidad.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold">8. Menores de edad</h2>
          <p className="text-sm leading-relaxed">
            LinKer no está dirigido a menores de 13 años. No recopilamos intencionalmente información de menores de esta edad. Si descubrimos que un menor se ha registrado, eliminaremos su cuenta.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold">9. Cambios en esta política</h2>
          <p className="text-sm leading-relaxed">
            Podemos actualizar esta política de privacidad periódicamente. Los cambios serán publicados en esta página con la fecha de actualización. Te recomendamos revisarla regularmente.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold">10. Contacto</h2>
          <p className="text-sm leading-relaxed">
            Si tienes preguntas sobre esta política de privacidad, puedes contactarnos a través de la plataforma.
          </p>
        </section>

        <div className="border-t border-gray-200 dark:border-neutral-700 pt-6">
          <Link to="/terminos" className="text-primary text-sm font-medium hover:underline">
            Ver Términos y Condiciones
          </Link>
        </div>
      </main>
    </div>
  );
};

export default PrivacidadPage;
