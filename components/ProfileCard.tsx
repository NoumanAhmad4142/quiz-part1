import { PersonAddAlt, PersonRemove } from "@mui/icons-material";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { tabs } from "@/constants/indea";

interface UserInfo {
	following: { _id: string }[];
	// Add other properties as needed
}
interface LoggedInUser {
	id: string;
	name: string;
	email: string;
	image: string;
}
interface UserData {
	_id: string;
	profilePhoto: string;
	name: string;
	email: string;
	username: string;
	image: string;
	clerkId: string;
	firstName: string;
	lastName: string;
	posts: Post[];
	followers: Array<string>;
	following: Array<string>;
}

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

interface ProfileCardProps {
	userData: UserData;
	activeTab: string;
	update: () => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
	userData,
	activeTab,
	update,
}) => {
	const [userInfo, setUserInfo] = useState<UserInfo>({ following: [] });
	const { data: session } = useSession();

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

	useEffect(() => {
		// Fetch updated userData when userInfo changes
		const fetchUpdatedUserData = async () => {
			const response = await fetch(`/api/user/${userData._id}`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			});
			const updatedData = await response.json();
			// update(); // Call the update function to refresh the page
		};

		if (userInfo) {
			fetchUpdatedUserData();
		}
	}, [userInfo, userData._id, update]);

	const isFollowing = userInfo?.following?.find(
		(item) => item._id === userData._id
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

		// Update local state immediately
		if (isFollowing) {
			setUserInfo((prev) => ({
				...prev,
				following: prev.following.filter(
					(item) => item._id !== userData._id
				),
			}));
			userData.followers = userData.followers.filter(
				(id) => id !== session?.user.id
			);
		} else {
			setUserInfo((prev) => ({
				...prev,
				following: [...prev.following, { _id: userData._id }],
			}));
			if (session?.user.id) {
				userData.followers.push(session.user.id);
			}
		}

		update(); // Call the update function to refresh the page
	};

	return (
		<div className="flex flex-col gap-9">
			<div className="flex justify-between items-start">
				<div className="flex gap-5 items-start">
					<Image
						src={
							`/uploads/profileImage/${userData.image}` ||
							"/default-profile.png"
						} // Provide a default image path
						alt="profile photo"
						width={100}
						height={100}
						className="rounded-full w-32 h-32 "
						layout="fixed"
						objectFit="cover"
					/>

					<div className="flex flex-col gap-3">
						<p className="text-3xl font-bold max-sm:text-4xl max-sm:font-bold">
							{userData.name}
						</p>
						<p className="text-subtle-semibold">
							@{userData.email}
						</p>

						<div className="flex gap-7 text-small-bold max-sm:gap-4">
							<div className="flex max-sm:flex-col gap-2 items-center max-sm:gap-0.5">
								<p className="text-green-600">
									{userData.posts.length}
								</p>
								<p className="text-green-600">Posts</p>
							</div>
							<div className="flex max-sm:flex-col gap-2 items-center max-sm:gap-0.5">
								<p className="text-green-600">
									{userData.followers.length}
								</p>
								<p className="text-green-600">Followers</p>
							</div>
							<div className="flex max-sm:flex-col gap-2 items-center max-sm:gap-0.5">
								<p className="text-green-600">
									{userData.following.length}
								</p>
								<p className="text-green-600">Following</p>
							</div>
						</div>
					</div>
					{session?.user?.id !== userData.clerkId &&
						(isFollowing ? (
							<PersonRemove
								sx={{
									color: "#7857FF",
									cursor: "pointer",
									fontSize: "40px",
								}}
								onClick={() => handleFollow()}
							/>
						) : (
							<PersonAddAlt
								sx={{
									color: "#7857FF",
									cursor: "pointer",
									fontSize: "40px",
								}}
								onClick={() => handleFollow()}
							/>
						))}
				</div>
			</div>

			<div className="flex gap-6">
				{tabs.map((tab) => (
					<Link
						key={tab.name}
						className={`tab ${
							activeTab === tab.name
								? "flex bg-purple-600 rounded-lg w-23 text-center font-bold h-10 text-white items-center justify-center"
								: "flex bg-accent-600 rounded-lg w-23 text-center font-bold h-10 items-center justify-center"
						}`}
						href={`/profile/${
							userData._id
						}/${tab.name.toLowerCase()}`}
					>
						{tab.name}
					</Link>
				))}
			</div>
		</div>
	);
};

export default ProfileCard;
