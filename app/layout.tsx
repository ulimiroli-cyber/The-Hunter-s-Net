import type { Metadata } from "next";
import { VT323 } from "next/font/google";
import "./globals.css";

const vt323 = VT323({ 
  weight: '400',
  subsets: ["latin"],
  variable: '--font-vt323',
});

export const metadata: Metadata = {
  title: "The Hunter's Net",
  description: "Clandestine network for hunters. Est. 2005.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${vt323.variable}`}>
      <body className="bg-hunter-black text-terminal-green font-mono min-h-screen">
        <main className="max-w-4xl mx-auto p-4 flex flex-col md:flex-row gap-6">
          {/* Aquí iría un componente Sidebar si lo deseas */}
          <div className="flex-1">
            <header className="border-b-4 border-double border-terminal-green pb-4 mb-8">
              <h1 className="text-5xl uppercase tracking-widest text-center">
                {`[ THE HUNTER'S NET ]`}
              </h1>
              <p className="text-center text-sm">SECURE CONNECTION ESTABLISHED... VERIFYING SIGILS...</p>
            </header>
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}