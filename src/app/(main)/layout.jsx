import { Footer } from "../../components/shared/footer2";
import { Navbar } from "../../components/shared/navbar";

export default function MainLayout({ children }) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-10">
        {children}
      </main>
      <Footer />
    </>
  );
}
