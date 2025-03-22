"use client";

import { useEffect, useState } from "react";
import Posting from "@/components/Posting"; // Import the Posting component
import { useSession } from "next-auth/react";

const CreatePost = () => {
	const [userData, setUserData] = useState({});
	const { data: session, status } = useSession();

	const getUser = async () => {
		if (session?.user?.id) {
			const response = await fetch(`/api/user/${session.user.id}`);
			const data = await response.json();
			setUserData(data);
		}
	};

	useEffect(() => {
		if (status === "authenticated") {
			getUser();
		}
	}, [session, status]);

	const postData = {
		creatorId: session?.user?.id,
		caption: "",
		tag: "",
		postPhoto: null,
	};

	return (
		<div className="mt-10 container mx-auto px-4">
			<h1 className="text-2xl font-bold">Create Post</h1>
			<div className="pt-6">
				<Posting post={postData} apiEndpoint="/api/post/new" />
			</div>
		</div>
	);
};

export default CreatePost;
