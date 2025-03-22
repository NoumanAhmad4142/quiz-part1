"use client";

import PostCard from "@/components/postcard";
import ProfileCard from "@/components/ProfileCard";
import TopBar from "@/components/topbar";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

interface LoggedInUser {
	id: string;
	name: string;
	email: string;
	image: string;
	comments: Array<{ comment: string; createdAt: string }>;
}

interface Creator {
	_id: string;
	name: string;
	email: string;
	image: string;
	profilePhoto: string;
	username: string;
	clerkId: string;
}

interface Post {
	_id: string;
	creator: Creator;
	caption: string;
	postPhoto: string;
	tag: string;
	likes: Array<string>;
}

interface UserData {
	_id: string;
	profilePhoto: string;
	name: string;
	email: string;
	username: string;
	clerkId: string;
	posts: Post[];
	followers: Array<string>;
	following: Array<string>;
	firstName: string;
	lastName: string;
}

const ProfilePosts = () => {
	const { id } = useParams();
	const { data: session } = useSession();
	const [userData, setUserData] = useState<UserData | null>(null);

	const getUser = async () => {
		const response = await fetch(`/api/user/profile/${id}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});
		const data = await response.json();
		setUserData(data);
	};

	useEffect(() => {
		getUser();
	}, [id]);

	console.log(userData);

	return (
		<div className="flex flex-col gap-9">
			<TopBar />
			{userData && (
				<ProfileCard
					userData={userData}
					activeTab="Posts"
					update={getUser}
				/>
			)}

			<div className="flex flex-col gap-9">
				{userData?.posts?.map((post) => (
					<PostCard
						key={post._id}
						post={post}
						creator={post.creator}
						loggedInUser={session?.user as LoggedInUser}
						update={getUser}
					/>
				))}
			</div>
		</div>
	);
};

export default ProfilePosts;
