"use client";

import ProfileCard from "@/components/ProfileCard";
import TopBar from "@/components/topbar";
import UserCard from "@/components/UserCard";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

interface Post {
	_id: string;
	creator: Creator;
	caption: string;
	postPhoto: string;
	tag: string;
	likes: Array<string>;
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

interface UserData {
	_id: string;
	profilePhoto: string;
	name: string;
	email: string;
	username: string;
	clerkId: string;
	firstName: string;
	lastName: string;
	posts: Post[];
	followers: string[];
	following: UserData[];
}

const Page = () => {
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

	return (
		<div className="flex flex-col gap-9">
			<TopBar />
			{userData && (
				<ProfileCard
					userData={userData}
					activeTab="Following"
					update={getUser}
				/>
			)}

			<div className="flex flex-col gap-9">
				{userData?.following?.map((user) => (
					<UserCard key={user._id} userData={user} update={getUser} />
				))}
			</div>
		</div>
	);
};

export default Page;
