import type { ReactNode } from "react";
import Footer from "./footer/Footer";
import Header from "./header/Header";
import Main from "./main/Main";

function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <Main>{children}</Main>
      <Footer />
    </>
  );
}

export default Layout;
