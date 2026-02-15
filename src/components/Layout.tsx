import { Outlet, useLocation } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { PageTransition } from "./PageTransition";

export function Layout() {
  const location = useLocation();

  return (
    <>
      <Header />
      <main className="flex-1 min-h-0">
        <PageTransition key={location.pathname}>
          <Outlet />
        </PageTransition>
      </main>
      <Footer />
    </>
  );
}
