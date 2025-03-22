import {
	Bookmark,
	BookmarkBorder,
	BorderColor,
	Delete,
	Favorite,
	FavoriteBorder,
	InsertComment,
} from "@mui/icons-material";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import CommentModal from "./CommentModal";
import Comment from "./Comment";

interface Post {
	_id: string;
	caption: string;
	postPhoto: string;
	tag: string;
	likes: Array<string>;
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

interface LoggedInUser {
	id: string;
	name: string;
	image: string;
}

interface PostCardProps {
	post: Post;
	creator: Creator;
	loggedInUser: LoggedInUser;
	update: () => void;
}

interface UserData {
	_id: string;
	likedPosts: Array<{ _id: string }>;
	savedPosts: Array<{ _id: string }>;
}

const PostCard = ({ post, creator, loggedInUser, update }: PostCardProps) => {
	const [userData, setUserData] = useState<UserData | null>(null);
	const [isLiked, setIsLiked] = useState<boolean>(false);
	const [shouldShowModal, setShouldShowModal] = useState(false);

	const showModal = () => {
		setShouldShowModal(true);
	};
	const hideModal = () => {
		setShouldShowModal(false);
	};

	const getUser = async () => {
		const response = await fetch(`/api/user/${loggedInUser.id}`);
		const data = await response.json();
		setUserData(data);
		setIsLiked(data.likedPosts.some((item: any) => item._id === post._id));
		console.log(data);
	};

	useEffect(() => {
		getUser();
	}, []);

	if (!post || !post._id) {
		return null; // or some fallback UI
	}

	const handleLike = async () => {
		try {
			setIsLiked(!isLiked);
			const response = await fetch(
				`/api/user/${loggedInUser.id}/like/${post._id}`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
				}
			);

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.json();
			setUserData(data);
			const liked = data.likedPosts.some(
				(item: any) => item._id === post._id
			);

			// Update the post likes array
			if (liked) {
				post.likes.push(loggedInUser.id);
				setIsLiked(isLiked); //
			} else {
				post.likes = post.likes.filter(
					(userId) => userId !== loggedInUser.id
				);
				setIsLiked(!isLiked); //
			}

			update();
		} catch (error) {
			console.error("Error liking post:", error);
		}
		// const handleDelete = async () => {
		// 	await fetch(`/api/post/${post._id}/${userData._id}`, {
		// 		method: "DELETE",
		// 	});
		// 	update();
		// };
	};
	return (
		<div className="rounded-lg flex flex-col gap-4 bg-card mb-4 mx-5 p-5 max-sm:gap-2 max-w-2/3">
			<div className="flex justify-between">
				<Link href={`/profile/${creator._id}/posts`}>
					<div className="flex gap-3 items-center">
						<Image
							src={
								creator.image
									? `/uploads/profileImage/${creator.image}`
									: "/default-profile.png"
							} // Provide a default image path
							alt="profile photo"
							width={50}
							height={50}
							className="rounded-full w-10 h-10"
							style={{ borderRadius: "50%" }}
						/>
						<div className="flex flex-col gap-1">
							<p className="text-medium font-semibold">
								{creator.name}
							</p>
							<p className="text-xs font-light">
								@{creator.email}
							</p>
						</div>
					</div>
				</Link>

				{loggedInUser.id === creator._id && (
					<Link href={`/edit-post/${post._id}`}>
						<BorderColor
							sx={{
								color: "var(--icon-color-light)",
								cursor: "pointer",
							}}
						/>
					</Link>
				)}
			</div>

			<p className="text-body-normal font-semibold max-sm:text-small-normal">
				{post.caption}
			</p>

			<Image
				src={post.postPhoto || "/default-post.png"} // Provide a default image path
				alt="post photo"
				width={200}
				height={150}
				className="rounded-lg max-w-full"
				layout="responsive"
			/>

			<p className="text-base-semibold text-purple-600 font-bold  max-sm:text-small-normal">
				{post.tag}
			</p>

			<div className="flex justify-between">
				<div className="flex gap-2 items-center">
					{!isLiked ? (
						<FavoriteBorder
							sx={{
								color: ".dark",
								cursor: "pointer",
							}}
							onClick={handleLike}
						/>
					) : (
						<Favorite
							sx={{ color: "red", cursor: "pointer" }}
							onClick={handleLike}
						/>
					)}
					<p className="text-light-1">{post.likes.length}</p>
					<div className="flex gap-2 items-center">
						<InsertComment
							sx={{
								color: ".dark",
								cursor: "pointer",
							}}
							onClick={showModal}
						/>
						<p className="text-light-1">{post.comments.length}</p>

						<CommentModal
							show={shouldShowModal}
							postId={post._id}
							creatorName={creator.name}
							creatorEmail={creator.email}
							creatorImage={creator.image}
							loggedInUserName={loggedInUser.name}
							loggedInUserImage={loggedInUser.image}
							onDelete={() => {
								update();
								hideModal();
							}}
							onHide={hideModal}
						/>
					</div>
				</div>

				{loggedInUser.id === creator._id && (
					<Delete
						sx={{
							color: ".dark",
							cursor: "pointer",
						}}
						onClick={() => {}}
					/>
				)}
			</div>
			{post.comments.map((comment, index) => (
				<Comment
					key={index}
					creatorImage={creator.image}
					creatorName={creator.name}
					creatorEmail={creator.email}
					commentText={comment.comment}
					createdAt={comment.createdAt}
				/>
			))}
		</div>
	);
};

export default PostCard;
