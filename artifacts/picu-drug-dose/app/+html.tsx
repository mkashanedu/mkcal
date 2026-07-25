import { ScrollViewStyleReset } from "expo-router/html";
import React from "react";

/**
 * Custom HTML shell for the Expo web build.
 * Injects PWA meta tags so the app installs correctly
 * when added to a mobile home screen.
 */
export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover, shrink-to-fit=no"
        />
        <meta
          name="description"
          content="PeadsCal — Neonatal, Pediatric & Adult Dose Calculator for clinical professionals."
        />

        {/* PWA manifest */}
        <link rel="manifest" href="/manifest.json" />

        {/* Theme / brand colours */}
        <meta name="theme-color" content="#0891B2" />
        <meta name="msapplication-TileColor" content="#0891B2" />
        <meta name="application-name" content="PeadsCal" />

        {/* iOS home-screen PWA */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="PeadsCal" />
        <link rel="apple-touch-icon" href="/icon.png" />
        <link rel="apple-touch-icon" sizes="192x192" href="/icon.png" />
        <link rel="apple-touch-icon" sizes="512x512" href="/icon.png" />

        {/* Favicon */}
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="shortcut icon" href="/favicon.png" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="PeadsCal — Pediatric Drug Dose Calculator" />
        <meta
          property="og:description"
          content="96+ medications, weight-based dosing, emergency resuscitation, infusion calculator — for PICU professionals."
        />
        <meta property="og:image" content="/icon.png" />

        {/* Expo Router web style reset */}
        <ScrollViewStyleReset />
      </head>
      <body>{children}</body>
    </html>
  );
}
