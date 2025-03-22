"use client";

import PostCard from "@/components/postcard";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import TopBar from "@/components/topbar";

type LoggedInUser = {
	_id: string;
	id: string;
	name: string;
	email: string;
	image: string;
	profilePhoto: string;
	username: string;
	clerkId: string;
};

type Creator = {
	_id: string;
	name: string;
	email: string;
	image: string;
	profilePhoto: string;
	username: string;
	clerkId: string;
};

type Post = {
	_id: string;
	creator: Creator;
	caption: string;
	tag: string;
	postPhoto: string;
	likes: Array<string>;
	createdAt: string;
	updatedAt: string;
	comments: Array<{ comment: string; createdAt: string }>;
};

const SearchPost = () => {
	const { query } = useParams();
	const { data: session } = useSession();
	const [searchedPosts, setSearchedPosts] = useState<Post[]>([]);

	const getSearchedPosts = async () => {
		const response = await fetch(`/api/search/posts/${query}`);
		const data = await response.json();
		setSearchedPosts(data);
	};

	useEffect(() => {
		getSearchedPosts();
	}, [query]);

	return (
		<div className="flex flex-col mt-10 mx-5 gap-10">
			<TopBar />
			<h1 className="mb-5 text-4xl font-bold text-light-1">
				Search Post
			</h1>

			<div className="flex gap-6">
				<Link
					className="px-4 py-2 rounded-lg text-small-bold font-bold w-20 text-center  transition-color duration-300"
					href={`/search/posts/${query}`}
				>
					Post
				</Link>
				<Link
					className="px-4 py-2 rounded-lg text-small-bold font-bold bg-indigo-700 text-white w-20 text-center hover:bg-indigo-800  transition-color duration-300"
					href={`/search/people/${query}`}
				>
					People
				</Link>
			</div>

			{searchedPosts.map((post) => (
				<PostCard
					key={post._id}
					post={post}
					creator={post.creator}
					loggedInUser={session?.user as LoggedInUser}
					update={getSearchedPosts}
				/>
			))}
		</div>
	);
};

export default SearchPost;
