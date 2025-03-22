"use client";

import TopBar from "@/components/topbar";
import UserCard from "@/components/UserCard";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const SearchPeople = () => {
	const { query } = useParams();

	const [loading, setLoading] = useState(true);

	interface Person {
		_id: string;
		user: string;
		email: string;
		name: string;
		firstName: string;
		lastName: string;
		age: number;
		location: string;
		username: string;
		profilePhoto: string;
		clerkId: string;
	}

	const [searchedPeople, setSearchedPeople] = useState<Person[]>([]);

	const getSearchedPeople = async () => {
		const response = await fetch(`/api/user/search/${query}`);
		const data = await response.json();
		setSearchedPeople(data);
	};

	useEffect(() => {
		getSearchedPeople();
	}, [query]);

	return (
		<div className="flex flex-col mt-10 mx-5 gap-10">
			<TopBar />
			<h1 className="mb-5 text-4xl font-bold ">Search People</h1>
			<div className="flex gap-6">
				<Link
					className="px-4 py-2 rounded-lg text-small-bold font-bold bg-indigo-700 text-white w-20 text-center hover:bg-indigo-800 hover:text-white transition-color duration-300"
					href={`/search/posts/${query}`}
				>
					Posts
				</Link>
				<Link
					className="px-4 py-2 rounded-lg text-small-bold font-bold w-20 text-center  transition-color duration-300"
					href={`/search/people/${query}`}
				>
					People
				</Link>
			</div>

			{searchedPeople.map((person) => (
				<UserCard
					key={person._id}
					userData={person}
					update={getSearchedPeople}
				/>
			))}
		</div>
	);
};

export default SearchPeople;
