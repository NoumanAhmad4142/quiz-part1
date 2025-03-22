"use client";

import PostEdit from "@/components/postEdit";
import Posting from "@/components/Posting"; // Import the Posting component
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Post {
	id: string;
	creatorId: string;
	caption: string;
	tag: string;
	postPhoto: string;
}

const EditPost = () => {
	const { id } = useParams();

	const [postData, setPostData] = useState<Post>({
		id: "",
		creatorId: "",
		caption: "",
		tag: "",
		postPhoto: "",
	});

	const getPost = async () => {
		const response = await fetch(`/api/post/${id}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});
		const data = await response.json();
		setPostData(data);
	};

	useEffect(() => {
		getPost();
	}, [id]);
	return (
		<div className="mt-10 container mx-auto px-4">
			<h1 className="text-2xl font-bold">Edit Post</h1>
			<div className="pt-6">
				<PostEdit post={postData} apiEndpoint={`/api/post/${id}`} />
			</div>
		</div>
	);
};

export default EditPost;
