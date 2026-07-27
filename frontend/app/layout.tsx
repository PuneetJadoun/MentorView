import "./globals.css";

export const metadata = {
  title: "Typeform Clone",
  description: "Scaler SDE Assignment",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
