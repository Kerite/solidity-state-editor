import {AntdRegistry} from "@ant-design/nextjs-registry";
import {App} from "antd";

import "./globals.css";
import {Inter} from "next/font/google";
const InterFont = Inter({subsets: ["latin"]});

export default function RootLayout({children,}: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="en">
    <body className={InterFont.className}>
    <AntdRegistry>
      <App>{children}</App>
    </AntdRegistry>
    </body>
    </html>
  );
}
