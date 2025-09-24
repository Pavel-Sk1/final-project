import { Routes, Route } from "react-router";
import { useEffect } from "react";
import { HomePage, SignInPage } from "@/pages";
import { Layout } from "./layout/Layout";
import { CLIENT_ROUTES, useAppDispatch } from "@/shared";
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
        </Route>
      </Routes>
    </>
  );
}
