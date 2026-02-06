import "./globals.css";
import Header from "@/src/app/components/Header";


export const metadata = {
  title: "Conference Site",
  description: "Conference portal",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar">
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}
