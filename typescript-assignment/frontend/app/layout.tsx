import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Address Picker - TypeScript Assignment",
  description: "A smart delivery address picker with caching mechanism",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
