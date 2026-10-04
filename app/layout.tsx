// ========================================================
// WEBSITE ERROR SWITCH:
// true  = Error dikhega (Application error screen)
// false = Website bilkul normal chalegi
// ========================================================
const SHOW_ERROR = true;

import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { headers } from "next/headers";
import { Sora, Source_Sans_3 } from "next/font/google";
import "./globals.css";
import { getSettingsMap } from "@/server/repositories/settings.repository";
import { ToastViewport } from "@/components/shared/ToastViewport";
import { BookingModal } from "@/components/website/BookingModal";
import { siteUrl } from "@/lib/utils/cn";
import { resolveSiteIcon } from "@/lib/site-images";

const display = Sora({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const body = Source_Sans_3({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#071207",
};

export async function generateMetadata(): Promise<Metadata> {
  if (SHOW_ERROR) {
    return { title: "Application Error" };
  }
  try {
    const settings = await getSettingsMap();
    const icon = resolveSiteIcon(settings);
    const iconType = icon.endsWith(".png")
      ? "image/png"
      : icon.endsWith(".svg")
        ? "image/svg+xml"
        : icon.endsWith(".webp")
          ? "image/webp"
          : icon.endsWith(".jpg") || icon.endsWith(".jpeg")
            ? "image/jpeg"
            : undefined;
    return {
      metadataBase: new URL(siteUrl()),
      title: {
        default: settings["seo.default_title"] || settings["business.name"] || "TV Repair",
        template: `%s | ${settings["business.name"] || "TV Repair"}`,
      },
      description: settings["seo.default_description"] || "",
      icons: icon
        ? {
            icon: [{ url: icon, type: iconType }],
            shortcut: icon,
            apple: icon,
          }
        : undefined,
      verification: {
        google:
          settings["seo.gsc"] ||
          process.env.GOOGLE_SEARCH_CONSOLE ||
          "2rnz21iIitzh_wa3K5TgEeH9ulgPVKyUosvwBgj_da4",
      },
    };
  } catch {
    return {
      title: "TV Repair Service",
      verification: {
        google:
          process.env.GOOGLE_SEARCH_CONSOLE ||
          "2rnz21iIitzh_wa3K5TgEeH9ulgPVKyUosvwBgj_da4",
      },
    };
  }
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  if (SHOW_ERROR) {
    let domain = "abhishekledtvrepair.in";
    try {
      const headersList = await headers();
      const host = headersList.get("x-forwarded-host") || headersList.get("host") || "";
      const cleanHost = host.split(":")[0]?.trim();
      if (cleanHost && cleanHost !== "localhost" && cleanHost !== "127.0.0.1") {
        domain = cleanHost;
      }
    } catch {
      // fallback
    }

    return (
      <html lang="en">
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width" />
          <title>Application Error</title>
          <style
            dangerouslySetInnerHTML={{
              __html: `
                body {
                  margin: 0;
                  padding: 16px;
                  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
                  font-size: 14px;
                  line-height: 1.5;
                  color: #000;
                  background: #fff;
                }
                p {
                  margin: 0 0 8px 0;
                }
              `,
            }}
          />
        </head>
        <body>
          <p>
            Application error: a server-side exception has occurred while loading {domain} (see the server logs for more information).
          </p>
          <p>Digest: 1035318626</p>
        </body>
      </html>
    );
  }

  let ga = "";
  let gtm = "";
  let icon = "";
  try {
    const settings = await getSettingsMap();
    ga = settings["seo.ga"] || process.env.GOOGLE_ANALYTICS_ID || "";
    gtm = settings["seo.gtm"] || process.env.GOOGLE_TAG_MANAGER_ID || "";
    icon = resolveSiteIcon(settings);
  } catch {
    ga = process.env.GOOGLE_ANALYTICS_ID || "";
    gtm = process.env.GOOGLE_TAG_MANAGER_ID || "";
  }

  return (
    <html lang="en" className={`${display.variable} ${body.variable} h-full antialiased`} data-scroll-behavior="smooth">
      <head>
        <meta name="google-site-verification" content="2rnz21iIitzh_wa3K5TgEeH9ulgPVKyUosvwBgj_da4" />
        {icon ? (
          <>
            <link rel="icon" href={icon} />
            <link rel="shortcut icon" href={icon} />
            <link rel="apple-touch-icon" href={icon} />
          </>
        ) : null}
        {gtm ? (
          <script
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':Date.now(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtm}');`,
            }}
          />
        ) : null}
        {ga ? (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${ga}`} />
            <script
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${ga}');`,
              }}
            />
          </>
        ) : null}
      </head>
      <body className="min-h-full flex flex-col bg-paper text-ink">
        {children}
        <ToastViewport />
        <BookingModal />
      </body>
    </html>
  );
}
