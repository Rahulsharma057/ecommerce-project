import Providers from "./providers";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ToastContainer } from "react-toastify";
import Script from "next/script";
import "react-toastify/dist/ReactToastify.css";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
export const metadata = {
  title: "Veloura",
  description: "Premium Fashion & Lifestyle Ecommerce Store",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider>
          <Providers>
            <Navbar />
            <main>{children}</main>

            <ToastContainer
              position="bottom-left"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              pauseOnHover
              draggable
              theme="light"
              toastStyle={{
                fontSize: "16px",
                fontWeight: 500,
                padding: "16px 18px",
                borderRadius: "14px",
                minWidth: "340px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
              }}
              progressStyle={{
                background:
                  "linear-gradient(90deg, #22c55e, #3b82f6, #a855f7, #ec4899)",
                height: "4px",
              }}
            />

            <Footer />
          </Providers>
        </AppRouterCacheProvider>
        <script 
src="https://checkout.razorpay.com/v1/checkout.js"
/>
      </body>

    </html>
  );
}
