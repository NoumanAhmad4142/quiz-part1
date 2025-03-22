"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const RightSideBar = () => {
	const { data: session } = useSession();
	const [loading, setLoading] = useState(true);
	interface UserData {
		posts?: { length: number };
		followers?: { length: number };
		following?: { length: number };
		// Add other properties if needed
	}

	const [userData, setUserData] = useState<UserData>({});

	const avatarFallbackText =
		session?.user?.name?.charAt(0).toUpperCase() || "";

	const getUser = async () => {
		if (session?.user?.id) {
			const response = await fetch(`/api/user/${session.user.id}`);
			const data = await response.json();
			setUserData(data);
			setLoading(false);
		}
	};

	useEffect(() => {
		if (session?.user) {
			getUser();
		}
	}, [session?.user]);

	return (
		<div className="h-screen left-0 top-0 stickyoverflow-auto px-10 py-6 flex flex-col gap-6 max-md:hidden lg:w-[350px] 2xl:w-[350px] pr-10 custom-scrollbar">
			<div className="flex flex-col gap-2">
				<div className="flex flex-col gap-2 items-center ">
					<hr />
					{session && (
						<Link href={`/profile/${session.user.id}/posts`}>
							<Avatar>
								<AvatarImage
									className="hover: opacity-75 transition"
									src={session?.user?.image || undefined}
									alt="@shadcn"
								/>
								<AvatarFallback>
									{avatarFallbackText}
								</AvatarFallback>
							</Avatar>
						</Link>
					)}
					<p className="text-lg">{session?.user?.name}</p>
				</div>
				<div className="flex justify-between">
					<div className="flex flex-col items-center">
						<p className="text-bold">{userData?.posts?.length}</p>
						<p className="text-tiny-medium">Posts</p>
					</div>
					<div className="flex flex-col items-center">
						<p className="text-base-bold">
							{userData?.followers?.length}
						</p>
						<p className="text-tiny-medium">Followers</p>
					</div>
					<div className="flex flex-col items-center">
						<p className="text-base-bold">
							{userData?.following?.length}
						</p>
						<p className="text-tiny-medium">Following</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default RightSideBar;
