import { Inter } from "next/font/google";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { App } from "antd";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AntdRegistry>
          <App>{children}</App>
        </AntdRegistry>
      </body>
    </html>
  );
}
