import { Navbar } from "@/ui/navbar";
import { Footer } from "@/ui/footer";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
