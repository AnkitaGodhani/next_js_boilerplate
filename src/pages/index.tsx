import { useEffect, useState } from "react";
import { getLocalStorage } from "@/utils/localStorage";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { usePageFound } from "@/utils/hooks/usePageFound";

const Home = () => {
  // const [loading, setLoading] = useState(true); // Loading state
  const [session, setSession] = useState<any>(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isPageFound = usePageFound();

  useEffect(() => {
    const sessionData: any = getLocalStorage("session");
    if (sessionData) {
      setSession(JSON.parse(sessionData));
    } else {
      router.push("/auth/login");
    }
    // setLoading(false); // Set loading to false after checking session
  }, []);

  useEffect(() => {
    if (session) {
      const pathSegments = pathname?.split("/");
      if (
        pathname === "/" ||
        !(pathSegments[1] === session?.role) ||
        !isPageFound
      ) {
        console.log("session1", pathname);

        router.push(`/${session?.role}`);
      } else {
        if (searchParams.toString()) {
          console.log("session2", pathname);

          router.push(`/${pathname}?${searchParams.toString()}`);
        } else {
          console.log("session3", pathname);

          router.push(pathname);
        }
      }
    }
  }, [session, router, pathname, searchParams]);

  // if (loading && session) {
  //   return <CircularProgress />;
  // }
  // if (!session) {
  // return <Login />;
  // }
  return null;
};

export default Home;
