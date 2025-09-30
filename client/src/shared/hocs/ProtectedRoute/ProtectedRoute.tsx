import { CLIENT_ROUTES } from "@/shared/enums/client-routes";
import { useAppSelector } from "@/shared/hooks";
import { Navigate } from "react-router";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, isInitialized } = useAppSelector((store) => store.user);
  
  if (!isInitialized) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontSize: "18px",
        }}
      >
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to={CLIENT_ROUTES.HOME} />;
  }

  return <>{children}</>;
};
