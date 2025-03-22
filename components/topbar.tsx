"use client";
import { Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const TopBar = () => {
	const router = useRouter();
	const [search, setSearch] = useState("");
	return (
		<div className="flex justify-start items-center mt-6">
			<div className="relative flex items-center">
				<input
					type="text"
					className="w-full py-2 px-8 rounded-lg focus:outline-none text-light-1 text-small-semibold outline-medium border-light-2 border"
					placeholder="Search posts, people, ..."
					value={search}
					onChange={(e) => setSearch(e.target.value)}
				/>
				<Search
					className="absolute  right-2 text-light-1 cursor-pointer"
					onClick={() => router.push(`/search/posts/${search}`)}
				/>
			</div>

			<button
				className="items-center gap-2 rounded-lg py-2.5 px-3 ml-2  text-small-semibold border cursor-pointer hover:bg-indigo-700 hover:text-white transition-color duration-300"
				onClick={() => router.push("/create-post")}
			>
				<p>+ Create A Post</p>
			</button>

			<div className="flex gap-4 md:hidden">
				<Link href=""></Link>
			</div>
		</div>
	);
};

export default TopBar;
