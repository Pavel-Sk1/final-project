import { Routes, Route } from "react-router";
import { useEffect } from "react";
import { HomePage, SignInPage, InfoPage, VacancyPage } from "@/pages";
import { AdminPage } from "@/pages/admin";
import { Layout } from "./layout/Layout";
import { CLIENT_ROUTES, useAppDispatch } from "@/shared";
import { ProtectedRoute } from "@/shared";
import { refreshTokensThunk } from "@/entities";

export function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(refreshTokensThunk());
  }, [dispatch]);

  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path={CLIENT_ROUTES.AUTH} element={<SignInPage />} />
          <Route path={CLIENT_ROUTES.INFO} element={<InfoPage />} />
          <Route path={CLIENT_ROUTES.VACANCY} element={<VacancyPage />} />
          <Route
            path={CLIENT_ROUTES.ADMIN}
            element={
              <ProtectedRoute>
                <AdminPage />
              </ProtectedRoute>
            }
          />

        </Route>
      </Routes>
    </>
  );
}
