import Providers from "./providers";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
export const metadata = {
  title: "Veloura",
  description:
    "Premium Fashion & Lifestyle Ecommerce Store",
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider>
          <Providers>
            <Navbar />
            <main>{children}</main>
            <Footer />
          </Providers>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}