import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HomePage } from "../pages/HomePage";
import { MainLayout } from "../layouts/MainLayout";
import { LoginPage } from "../pages/LoginPage";
import { ProtectedRoute } from "../hooks/ProtectedRoute";
import { MiPerfilPage } from "../pages/MiPerfilPage";
import { PerfilPublicoPage } from "../pages/PerfilPublicoPage";
import { NotFoundPage } from "../pages/NotFoundPage";

export function MyRoutes() {
  return (
    <BrowserRouter>
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
        </Route>

        {/* ✅ 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
