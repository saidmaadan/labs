import { Footer } from "../../components/shared/footer2";
import { Navbar } from "../../components/shared/navbar";

export default function MainLayout({ children }) {
  return (
    <>
      <Navbar />
      <main className="container-center min-h-screen pt-20">
        {children}
      </main>
      <Footer />
    </>
  );
}
