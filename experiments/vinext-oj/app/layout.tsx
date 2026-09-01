import type { ReactNode } from "react";

export const metadata = {
  title: "Vinext on oj compatibility probe",
  description: "An isolated App Router fixture for measuring Vinext and oj compatibility.",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          color: "#edf4ff",
          background: "#07111f",
          fontFamily: "ui-monospace, SFMono-Regular, Consolas, monospace",
        }}
      >
        {children}
      </body>
    </html>
  );
}
