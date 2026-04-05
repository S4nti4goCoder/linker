import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "../hooks/ProtectedRoute";
import { MainLayout } from "../layouts/MainLayout";
import { SpinnerLocal } from "../components/ui/spinners/SpinnerLocal";

const LoginPage = lazy(() => import("../pages/LoginPage"));
const HomePage = lazy(() => import("../pages/HomePage"));
const MiPerfilPage = lazy(() => import("../pages/MiPerfilPage"));
const PerfilPublicoPage = lazy(() => import("../pages/PerfilPublicoPage"));
const MensajesPage = lazy(() => import("../pages/MensajesPage"));
const ColeccionesPage = lazy(() => import("../pages/ColeccionesPage"));
const NotFoundPage = lazy(() => import("../pages/NotFoundPage"));
const TerminosPage = lazy(() => import("../pages/TerminosPage"));
const PrivacidadPage = lazy(() => import("../pages/PrivacidadPage"));

export function MyRoutes() {
  return (
    <BrowserRouter>
      <Suspense fallback={<SpinnerLocal />}>
        <Routes>
          <Route
            path="/login"
            element={
              <ProtectedRoute authenticated={false}>
                <LoginPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/"
            element={
              <ProtectedRoute authenticated={true}>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<HomePage />} />
            <Route path="/mi-perfil" element={<MiPerfilPage />} />
            <Route path="/perfil/:id" element={<PerfilPublicoPage />} />
            <Route path="/mensajes" element={<MensajesPage />} />
            <Route path="/colecciones" element={<ColeccionesPage />} />
          </Route>

          <Route path="/terminos" element={<TerminosPage />} />
          <Route path="/privacidad" element={<PrivacidadPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
