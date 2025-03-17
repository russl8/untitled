import type { Metadata } from "next";
import { Geist, Geist_Mono, Roboto } from "next/font/google";
import "./globals.css";
import { ClerkProvider, SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/AppSidebar";
import { StoreProvider } from "@/store/StoreProvider";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Untitled",
  description: "",
};
const roboto = Roboto({
  weight: '400',
  subsets: ['latin'],
})
// If loading a variable font, you don't need to specify the font weight
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <StoreProvider>
      <ClerkProvider>
        <html >
          <body className={roboto.className}>
            <SidebarProvider defaultOpen={true}>
              <AppSidebar />
              <div className="w-full h-full">                
                <SidebarTrigger className="absolute hover:bg-transparent cursor-pointer hover:text-gray-600 z-[99999]" />
                <Toaster position="bottom-center" />

                {children}
              </div>
            </SidebarProvider>
          </body>
        </html>
      </ClerkProvider>
    </StoreProvider>
  );
}
