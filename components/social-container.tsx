"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import PostCard from "./postcard";
import TopBar from "./topbar";

type Creator = {
	_id: string;
	profilePhoto: string;
	username: string;
	name: string;
	image: string;
	avatar: string;
	clerkId: string;
	email: string;
};

const SocialContainer = () => {
	const [feedPost, setFeedPost] = useState<
		{
			_id: string;
			creator: Creator;
			caption: string;
			tag: string;
			postPhoto: string;
			likes: Array<string>;
			comments: Array<{ comment: string; createdAt: string }>;
		}[]
	>([]);
	const { data: session, status } = useSession();

	const getFeedPost = async () => {
		const response = await fetch("/api/post");
		const data = await response.json();
		setFeedPost(
			data.map((post: any) => ({
				...post,
				likes: post.likes || [],
				comments: post.comments || [],
			}))
		);
	};

	useEffect(() => {
		getFeedPost();
	}, []);

	return (
		<section className="flex flex-col flex-1 ">
			<TopBar />
			<div className="mt-6 mb-10 w-full">
				<h1 className="mb-5 text-4xl font-bold text-light-1">Feed</h1>
				<div className="w-full h-screen overflow-y-scroll">
					{feedPost.map((post) => (
						<PostCard
							key={post._id}
							post={post}
							creator={post.creator}
							loggedInUser={{
								id: session?.user?.id ?? "",
								name: session?.user?.name ?? "",
								email: session?.user?.email ?? "",
								image: session?.user?.image ?? "",
								role: session?.user?.role ?? "",
							}}
							update={getFeedPost}
						/>
					))}
				</div>
			</div>
		</section>
	);
};

export default SocialContainer;
