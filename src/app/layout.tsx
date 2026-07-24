import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import AnimatedWaterBackground from "@/components/common/AnimatedWaterBackground";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Industrias Vivo | Productos de Limpieza de Alta Calidad",
  description: "Fabricación y comercialización de productos de limpieza para el hogar y empresas en Bolivia. Desinfectantes, jabones, detergentes y soluciones químicas profesionales.",
  keywords: "productos de limpieza, desinfectantes, detergentes, Industrias Vivo, limpieza hogar, limpieza industrial",
};

import GoogleAuthProviderWrapper from "@/components/providers/GoogleAuthProviderWrapper";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className="h-full antialiased"
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground transition-colors duration-300" suppressHydrationWarning>
        <GoogleAuthProviderWrapper>
          <AnimatedWaterBackground />
          <Navbar />
          <main className="flex-grow flex flex-col">
            {children}
          </main>
          <Footer />
          <WhatsAppButton />
          <Toaster position="top-right" richColors />
        </GoogleAuthProviderWrapper>
      </body>
    </html>
  );
}
