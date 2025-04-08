import type { Metadata } from "next";
import { Poppins, Roboto } from "next/font/google";
import "./globals.css";
import { ClerkProvider, SignedIn, SignedOut, SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/AppSidebar";
import { StoreProvider } from "@/store/StoreProvider";
import { Toaster } from "react-hot-toast";
import { currentUser } from "@clerk/nextjs/server";


export const metadata: Metadata = {
  title: "Untitled",
  description: "",
};
const poppins = Poppins({
  weight: '400',
  subsets: ['latin'],
})
// If loading a variable font, you don't need to specify the font weight
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (

    <StoreProvider>
      <ClerkProvider>
        <html className="h-full">
          <body className={`${poppins.className} min-h-screen w-full bg-gradient-to-br from-indigo-50 via-white to-lusion-background text-lusion-black`}>
            <SidebarProvider defaultOpen={true}>
              <AppSidebar />
              <div className="flex flex-col w-full min-h-screen  ">
                {/* header  */}
                <div className="sticky top-0 z-50 flex justify-between items-center p-2   text-lusion-black shadow-md">
                  <SidebarTrigger className="cursor-pointer p-2 rounded-md hover:opacity-70 " />
                  <div className="flex items-center">
                    <SignedOut>
                      <SignInButton />
                    </SignedOut>

                    <SignedIn>
                      <div
                        className="flex items-center cursor-pointer"
                      >
                        <UserButton />
                      </div>
                    </SignedIn>
                  </div>
                </div>

                <div className=" flex-1">
                  <Toaster position="bottom-center" />
                  {children}
                </div>
              </div>
            </SidebarProvider>
          </body>
        </html>
      </ClerkProvider>
    </StoreProvider>
  );
}
