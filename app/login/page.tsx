"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { TriangleAlert } from "lucide-react";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

export default function Home() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>("");
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(""); // Clear previous errors
		const res = await signIn("credentials", {
			redirect: false,
			email,
			password,
		});
		if (res?.ok) {
			toast("Login successful");
			router.push("/");
		} else if (res?.error) {
			setError(res.error);
		} else {
			setError("An error occurred");
		}
	};

	const handleProvider = async (
		e: React.MouseEvent<HTMLButtonElement>,
		value: "github" | "google"
	) => {
		e.preventDefault();
		signIn(value, { callbackUrl: "/" });
	};

	return (
		<div className="flex justify-center relative">
			<div className="mx-auto max-w-lg px-6 lg:px-8 absolute py-20">
				<h1 className="text-center text-3xl font-bold"> Login </h1>
				<div className="rounded-2xl bg-accent shadow-xl">
					<div className="px-7 pb-5 mx-auto">
						<div className="mb-11">
							<h1 className="text-center font-manrope text-3xl font-bold leading-10 mb-2">
								Welcome Back
							</h1>
							<p className="text-center text-base font-medium leading-6">
								Please enter info below for login
							</p>
						</div>
						{!!error && (
							<div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive mb-6">
								<TriangleAlert />
								<p>{error}</p>
							</div>
						)}
						<form onSubmit={handleSubmit}>
							<input
								type="text"
								className="w-full h-12 placeholder:text-gray-400 text-lg font-normal leading-7 rounded-full border-gray-300 border shadow-sm focus:outline-none px-4 mb-6"
								placeholder="Email"
								value={email}
								name="email"
								onChange={(e) => setEmail(e.target.value)}
								required
							/>
							<input
								type="password"
								className="w-full h-12 placeholder:text-gray-400 text-lg font-normal leading-7 rounded-full border-gray-300 border shadow-sm focus:outline-none px-4 mb-1"
								placeholder="Password"
								value={password}
								name="password"
								onChange={(e) => setPassword(e.target.value)}
								required
							/>
							<button className="w-full h-12 text-white text-center text-base font-semibold leading-6 rounded-full hover:bg-indigo-800 transition-all duration-700 bg-indigo-600 shadow-sm my-6">
								Login
							</button>
						</form>
						<Separator />
						<div className="flex my-2 justify-center ms-auto items-center">
							<Button
								disabled={false}
								onClick={(e) => {
									handleProvider(e, "google");
								}}
								variant="outline"
								size="lg"
								className="bg-accent w-40 hover:bg-gray-300"
							>
								<FcGoogle className="size-8 top-2.5" />
							</Button>
							<Button
								disabled={false}
								onClick={(e) => {
									handleProvider(e, "github");
								}}
								variant="outline"
								size="lg"
								className="bg-accent w-40 hover:bg-gray-300 "
							>
								<FaGithub className="size-8 top-2.5" />
							</Button>
						</div>
						<Link
							href="/register"
							className="flex justify-center text-base font-medium leading-6"
						>
							Don’t have an account?{" "}
							<span className="text-indigo-600 font-semibold pl-3">
								Please Sign Up
							</span>
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
