import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
  themeColor: '#F6F1EB',
};

export const metadata: Metadata = {
  title: "Christine Vallet - Sophrologue | Gestion du stress, sommeil, bien-être",
  description: "Sophrologue certifiée à Delme. Accompagnement personnalisé pour la gestion du stress, l'amélioration du sommeil, la confiance en soi et le bien-être au quotidien.",
  keywords: "sophrologie, sophrologue, stress, sommeil, relaxation, bien-être, Delme, confiance en soi",
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Christine Vallet Sophrologie',
  },
  formatDetection: {
    telephone: true,
    email: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
