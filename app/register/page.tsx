"use client";
import Link from "next/link";
import { useState } from "react";
import { TriangleAlert } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { signIn } from "next-auth/react";

const Register = () => {
	const [emailError, setEmailError] = useState("");
	const [pending, setPending] = useState(false);
	const [error, setError] = useState("");
	const router = useRouter();
	const [form, setForm] = useState({
		name: "",
		email: "",
		password: "",
		age: "",
		confirmPassword: "",
		role: "teacher",
		profileimage: null as File | null,
		profileimageName: "",
	});

	const validateEmail = (email: string) => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			setEmailError("Invalid email address");
		} else {
			setEmailError("");
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setPending(true);

		// Debugging: Log form state
		console.log("Form state:", form);

		try {
			const formData = new FormData();
			formData.append("name", form.name);
			formData.append("email", form.email);
			formData.append("password", form.password);
			formData.append("confirmPassword", form.confirmPassword);
			formData.append("role", form.role);
			formData.append("age", form.age);
			if (form.profileimage) {
				formData.append("profileimage", form.profileimage);
			}

			// Debugging: Log FormData entries
			for (let [key, value] of formData.entries()) {
				console.log(`${key}: ${value}`);
			}

			const res = await fetch("/api/auth/signup", {
				method: "POST",
				body: formData,
			});
			const data = await res.json();
			if (res.status == 400) {
				setError(data.message);
			} else if (res.status == 500) {
				setError(data.message);
			} else if (res.status == 201) {
				toast.success(data.message);
				router.push("/login");
				setPending(false);
			} else {
				toast.error("An unknown error occurred");
			}
		} catch (error) {
			console.error("Error submitting form:", error);
			alert("An error occurred while submitting the form");
		} finally {
			setPending(false);
		}
	};

	return (
		<div className="flex justify-center relative">
			<div className="w-auto h- mx-auto max-w-lg px-6 lg:px-8 absolute py-20 px-6">
				<h1 className="text-center text-3xl font-bold">Register</h1>
				<div className="rounded-2xl bg-accent shadow-xl px-4">
					<div className="mb-11">
						<h1 className="text-center font-manrope text-3xl font-bold leading-10 mb-2">
							Create Account
						</h1>
						<p className="text-center text-base font-medium leading-6">
							Please enter the info below
						</p>
					</div>
					{!!error && (
						<div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive mb-6">
							<TriangleAlert />
							<p>{error}</p>
						</div>
					)}
					<form onSubmit={handleSubmit} className="space-y-3">
						<div className="mb-6">
							<input
								type="email"
								className={`w-full h-12 text-gray-900 placeholder:text-gray-400 text-lg font-normal leading-7 rounded-full border shadow-sm focus:outline-none px-4 ${
									emailError
										? "border-red-500"
										: "border-gray-300"
								}`}
								placeholder="Email"
								name="email"
								value={form.email}
								onChange={(e) => {
									setForm({ ...form, email: e.target.value });
									validateEmail(e.target.value);
								}}
							/>
							{emailError && (
								<p className="text-red-600 text-sm mt-1 ml-3">
									{emailError}
								</p>
							)}
						</div>
						<input
							type="text"
							className="w-full h-12 text-gray-900 placeholder:text-gray-400 text-lg font-normal leading-7 rounded-full border-gray-300 border shadow-sm focus:outline-none px-4 mb-6"
							placeholder="Name"
							disabled={pending}
							name="name"
							value={form.name}
							onChange={(e) =>
								setForm({ ...form, name: e.target.value })
							}
						/>
						<input
							type="number"
							className="w-full h-12 text-gray-900 placeholder:text-gray-400 text-lg font-normal leading-7 rounded-full border-gray-300 border shadow-sm focus:outline-none px-4 mb-6"
							placeholder="Age"
							name="age"
							disabled={pending}
							value={form.age}
							onChange={(e) =>
								setForm({ ...form, age: e.target.value })
							}
						/>
						<fieldset className="flex justify-center mb-6">
							<input
								id="teacher"
								className="peer/draft"
								type="radio"
								name="status"
								value="teacher"
								checked={form.role === "teacher"}
								onChange={(e) =>
									setForm({ ...form, role: e.target.value })
								}
							/>
							<label
								htmlFor="teacher"
								className="peer-checked/draft:text-sky-500 mr-6 text"
							>
								Teacher
							</label>
							<input
								id="student"
								className="peer/published"
								type="radio"
								name="status"
								value="student"
								checked={form.role === "student"}
								onChange={(e) =>
									setForm({ ...form, role: e.target.value })
								}
							/>
							<label
								htmlFor="student"
								className="peer-checked/published:text-sky-500"
							>
								Student
							</label>
						</fieldset>
						<input
							type="file"
							className="w-full h-12 text-gray-900 placeholder:text-gray-400 text-lg font-normal leading-7 rounded-full border-gray-300 border shadow-sm focus:outline-none px-4 mb-6"
							placeholder="Please upload profile picture"
							disabled={pending}
							name="profileimage"
							onChange={(e) => {
								const file = e.target.files?.[0];
								if (file) {
									setForm({
										...form,
										profileimage: file,
										profileimageName: file.name,
									});
								}
							}}
						/>
						{/* <input
							type="text"
							className="w-full h-12 text-gray-900 placeholder:text-gray-400 text-lg font-normal leading-7 rounded-full border-gray-300 border shadow-sm focus:outline-none px-4 mb-6"
							placeholder="Please upload profile picture"
							disabled={true}
							value={
								form.profileimageName ||
								"Please upload profile picture"
							}
						/> */}
						<input
							type="password"
							className="w-full h-12 text-gray-900 placeholder:text-gray-400 text-lg font-normal leading-7 rounded-full border-gray-300 border shadow-sm focus:outline-none px-4 mb-6"
							placeholder="Password"
							value={form.password}
							disabled={pending}
							name="password"
							onChange={(e) =>
								setForm({ ...form, password: e.target.value })
							}
						/>
						<input
							type="password"
							className="w-full h-12 text-gray-900 placeholder:text-gray-400 text-lg font-normal leading-7 rounded-full border-gray-300 border shadow-sm focus:outline-none px-4 mb-6"
							placeholder="Confirm password"
							value={form.confirmPassword}
							disabled={pending}
							name="password"
							onChange={(e) =>
								setForm({
									...form,
									confirmPassword: e.target.value,
								})
							}
						/>
						<button
							disabled={pending}
							className="w-full h-12 text-white text-center text-base font-semibold leading-6 rounded-full hover:bg-indigo-800 transition-all duration-700 bg-indigo-600 shadow-sm mb-5"
						>
							Submit
						</button>
					</form>
					<Separator />
					<div className="flex my-2 justify-center ms-auto items-center">
						<Button
							disabled={false}
							onClick={() => {}}
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
						href="/login"
						className="flex justify-center text-base font-medium leading-6"
					>
						Have an account?
						<span className="text-indigo-600 font-semibold pl-3 mb-6">
							Please Login
						</span>
					</Link>
				</div>
			</div>
		</div>
	);
};

export default Register;
