import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { HiX } from "react-icons/hi";
import { toast } from "sonner";

interface CommentModalProps {
	show: boolean;
	onHide: () => void;
	postId: string;
	creatorName: string;
	creatorEmail: string;
	creatorImage: string;
	loggedInUserName: string;
	loggedInUserImage: string;
}

const CommentModal: React.FC<CommentModalProps> = ({
	show,
	onHide,
	postId,
	creatorName,
	creatorEmail,
	creatorImage,
	loggedInUserName,
	loggedInUserImage,
}) => {
	const [input, setInput] = useState("");
	const { data: session } = useSession();

	const sendComment = async () => {
		try {
			const res = await fetch(`/api/post/comment/${postId}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					postId,
					comment: input,
					user: session?.user?.id,
					username: creatorName,
					useremail: creatorEmail,
					profileImg: creatorImage,
				}),
			});

			if (!res.ok) {
				throw new Error(`HTTP error! status: ${res.status}`);
			}

			const data = await res.json();
			console.log(data);
			toast.success("Comment posted successfully");
			setInput("");
			onHide();
		} catch (error) {
			console.error("Error submitting form:", error);
			alert("An error occurred while submitting the form");
		}
	};

	return (
		<Modal
			show={show}
			onHide={onHide}
			className="max-w-lg w-[90%] absolute top-24 left-[50%] translate-x-[-50%] bg-white border-2 border-gray-200 rounded-xl shadow-xl"
		>
			<div className="p-4">
				<div className="border-b border-gray-200 py-2 px-1.5">
					<HiX
						className="text-2xl text-gray-500 p-1 hover:bg-gray-200 rounded-full cursor-pointer"
						onClick={() => onHide()}
					/>
				</div>
				<div className="p-2 flex items-center space-x-1 relative">
					<span className="w-0.5 h-full z-[-1] absolute left-8 top-11 bg-gray-300" />
					<img
						src={`/uploads/profileImage/${creatorImage}`}
						alt="creator-img"
						className="h-11 w-11 rounded-full cursor-pointer hover:brightness-95"
						style={{ borderRadius: "50%" }}
					/>
					<h4 className="font-bold text-gray-800 sm:text-[16px] text-[15px] truncate">
						{creatorName}
					</h4>
					<span className="text-sm sm:text-[15px] text-gray-500 hover:underline truncate">
						@{creatorEmail}
					</span>
				</div>
				<p className="text-gray-500 text-[15px] sm:text-[16px] ml-16 mb-2">
					Please write your comment on this post.
				</p>
				<div className="flex p-3 space-x-3">
					<img
						src={`/uploads/profileImage/${loggedInUserImage}`}
						alt="user-img"
						className="h-11 w-11 rounded-full cursor-pointer hover:brightness-95"
						style={{ borderRadius: "50%" }}
					/>
					<div className="w-full divide-y divide-gray-200">
						<div>
							<textarea
								className="w-full border-none outline-none tracking-wide min-h-[50px] text-gray-700 placeholder:text-gray-500"
								placeholder="Enter Comment"
								rows={2}
								value={input}
								onChange={(e) => setInput(e.target.value)}
							></textarea>
						</div>
						<div className="flex items-center justify-end pt-2.5">
							<button
								className="bg-blue-400 text-white px-4 py-1.5 rounded-full font-bold shadow-md hover:brightness-95 disabled:opacity-50"
								disabled={input.trim() === ""}
								onClick={sendComment}
							>
								Reply
							</button>
						</div>
					</div>
				</div>
			</div>
		</Modal>
	);
};

export default CommentModal;
