"use client";

import ProfileCard from "@/components/ProfileCard";
import TopBar from "@/components/topbar";
import UserCard from "@/components/UserCard";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Follower {
	_id: string;
	// add other properties of Follower here
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
	posts: Array<string>;
	followers: Array<string>;
	following: Array<string>;
}

const Followers = () => {
	const { id } = useParams();

	const [loading, setLoading] = useState(true);

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
					activeTab="Followers"
					update={getUser}
				/>
			)}

			<div className="flex flex-col gap-9">
				{userData?.followers?.map((person) => (
					<UserCard
						key={person._id}
						userData={person}
						update={getUser}
					/>
				))}
			</div>
		</div>
	);
};

export default Followers;
