import './globals.css';

export const metadata = {
  title: 'Parking ESIEE-IT — Réservation de places',
  description: 'Système de gestion et de réservation de parking automatisé pour les étudiants de l\'ESIEE-IT.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
