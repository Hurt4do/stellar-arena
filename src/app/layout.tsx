import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Judge Portal",
  description: "Neon judge portal UI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className="font-oxanium antialiased min-h-screen bg-background text-foreground"
        style={{
          margin: 0,
          minHeight: "100vh",
          color: "#0b1220",
          background: "linear-gradient(to bottom, #f7f9ff, #eef2ff)",
          fontFamily: "var(--font-oxanium), sans-serif",
        }}
      >
        {children}
      </body>
    </html>
  );
}
