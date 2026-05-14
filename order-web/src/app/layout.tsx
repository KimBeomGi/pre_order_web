import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "react-hot-toast";


const pretendard = localFont({
  src: "./fonts/PretendardVariable.woff2",
  display: "swap",
  weight: "45 920",
  variable: "--font-pretendard",
});

export const metadata: Metadata = {
  title: "지니오더",
  description: "더 스마트한 주문 지니 QR오더",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${pretendard.variable} antialiased`}>
        {children}
        <Toaster
          position="bottom-center"
          containerStyle={{
            // 기본 1rem, 명시해주면, 명시해준대로.
            bottom: "3.8125em",
          }}
          toastOptions={{
            duration: 3000,
          }}
        />
      </body>
    </html>
  );
}
