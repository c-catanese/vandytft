import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Vanderbilt TFT",
  description: "Leaderboard for Vanderbilt TFT Players",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
      <link rel="icon" href="/vanderbilt.svg"/>
      <meta property="og:title" content="Vanderbilt TFT" />
      <meta property="og:description" content="Leaderboard for Vanderbilt TFT Players" />
      <meta property="og:image" content="/vanderbilt.svg" /> 
      <meta property="og:url" content="https://vandytft.com" /> 
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Vanderbilt TFT" />
      <meta name="twitter:description" content="Leaderboard for Vanderbilt TFT Players" />
      <meta name="twitter:image" content="/vanderbilt.svg" /> 
        <link rel="icon" href="/vanderbilt.svg"/>
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
