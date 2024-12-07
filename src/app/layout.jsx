import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import { AntdProvider } from "@/components/providers/antd-provider";
import "./globals.css";
import { Providers } from "../components/providers/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Inventivelabs",
  description: "Inventivelabs - AI Software Development Company",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AntdProvider>
          <Providers>
            {children}
          </Providers>
          <Toaster />
        </AntdProvider>
      </body>
    </html>
  );
}
