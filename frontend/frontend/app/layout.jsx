export const metadata = {
  title: 'Vonaxity',
  description: 'Home nurse visits in Albania',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
