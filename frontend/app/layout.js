import "./globals.css";
import "./assets/magnifying-glass.svg";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
