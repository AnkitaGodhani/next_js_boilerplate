// src/components/ProtectedRoute.tsx
import { getLocalStorage } from "@/utils/localStorage";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      const token = getLocalStorage("accessToken");
      const sessionData = getLocalStorage("session");
      const session = sessionData ? JSON.parse(sessionData) : null;

      setToken(token);
      setSession(session);
      
      if (!token || !session) {
        router.push("/auth/login"); // Redirect to login page if not authenticated
      }
    }
  }, [router]);

  if (!token || !session) {
    return null; // or you can return a loading spinner or some other component
  }

  return <>{children}</>;
};

export default ProtectedRoute;


// import { useRouter } from 'next/router'
// import { useUser } from '../../lib/hooks'
// import Login from '../../pages/login'

// const withAuth = Component => {
//   const Auth = (props) => {
//     const { user } = useUser();
//     const router = useRouter();

//     if (user === null && typeof window !== 'undefined') {
//       return (
//         <Login />
//       );
//     }

//     return (
//       <Component {...props} />
//     );
//   };

//   if (Component.getInitialProps) {
//     Auth.getInitialProps = Component.getInitialProps;
//   }

//   return Auth;
// };

// export default withAuth;
