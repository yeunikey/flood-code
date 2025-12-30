import "./globals.css";
import 'mapbox-gl/dist/mapbox-gl.css';

import Authorize from "@/shared/ui/Authorize";
import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { ToastContainer } from "react-toastify";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Приложение паводков",
  description: "Научно-Инновационный Центр Big Data and Blockchain Technologies",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${roboto.variable} antialiased`}
      >

        <ToastContainer position="bottom-right" stacked />

        <Authorize>
          {children}
        </Authorize>
      </body>
    </html>
  );
}
