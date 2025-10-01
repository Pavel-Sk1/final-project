import { CLIENT_ROUTES } from "@/shared/enums/client-routes";
import { useAppSelector } from "@/shared/hooks";
import { Navigate } from "react-router";
import styles from "./ProtectedRoute.module.css";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, isInitialized } = useAppSelector((store) => store.user);

  if (!isInitialized) {
    return <div className={styles.loadingContainer}>Loading...</div>;
  }

  if (!user) {
    return <Navigate to={CLIENT_ROUTES.HOME} />;
  }

  return <>{children}</>;
};
