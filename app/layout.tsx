import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SideNav from "@/components/side-nav";
import Header from "./header";
import ContextProvider from "@/components/context-provider";
import { Toaster } from "@/components/ui/sonner";
import SessionProviderWrapper from "@/components/SessionProviderWrapper";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Teaching Assistant",
	description: "Help you teaching in a new creative way",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<SessionProviderWrapper>
					<ContextProvider>
						<Toaster />
						<Header />
						<div className="flex w-full">
							<SideNav />
							<div className="w-full overflow-x-auto bg-accent">
								<div className="overflow-auto">
									<div className="flex justify-center w-full h-[calc(100vh-70px)] relative">
										<div className="w-full">{children}</div>
									</div>
								</div>
							</div>
						</div>
					</ContextProvider>
				</SessionProviderWrapper>
			</body>
		</html>
	);
}
