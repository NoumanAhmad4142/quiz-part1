"use client";

import { PersonAddAlt, PersonRemove } from "@mui/icons-material";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

interface UserData {
	email: string;
	name: string;
	_id: string;
	firstName: string;
	lastName: string;
	username: string;
	profilePhoto: string;
	clerkId: string;
	image: string;
}

interface UserCardProps {
	userData: UserData;
	update: () => void;
}

const UserCard: React.FC<UserCardProps> = ({ userData, update }) => {
	const { data: session } = useSession();

	interface UserInfo {
		following: { _id: string }[];
		// Add other properties if needed
	}

	const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

	const getUser = async () => {
		const response = await fetch(`/api/user/${session?.user.id}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});
		const data = await response.json();
		setUserInfo(data);
	};

	useEffect(() => {
		if (session?.user) {
			getUser();
		}
	}, [session?.user]);

	const isFollowing = userInfo?.following?.find(
		(item: { _id: string }) => item._id === userData._id
	);

	const handleFollow = async () => {
		const response = await fetch(
			`/api/user/${session?.user.id}/follow/${userData._id}`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
			}
		);
		const data = await response.json();
		setUserInfo(data);
		update();
	};

	return (
		<div className="flex justify-between items-center bg-card p-4 rounded-lg max-w-1/2">
			<Link
				className="flex gap-4 items-center"
				href={`/profile/${userData._id}/posts`}
			>
				<Image
					src={`/uploads/profileImage/${userData.image}`}
					alt="profile photo"
					width={50}
					height={50}
					className="rounded-full w-15 h-15"
				/>
				<div className="flex flex-col gap-1">
					<p className="text-small-semibold text-light-1">
						{userData.name}
					</p>
					<p className="text-subtle-medium text-light-3">
						@{userData.email}
					</p>
				</div>
			</Link>

			{session?.user.id !== userData._id &&
				(isFollowing ? (
					<PersonRemove
						sx={{ color: "#7857FF", cursor: "pointer" }}
						onClick={handleFollow}
					/>
				) : (
					<PersonAddAlt
						sx={{ color: "#7857FF", cursor: "pointer" }}
						onClick={handleFollow}
					/>
				))}
		</div>
	);
};

export default UserCard;
