import React from "react";

interface CommentProps {
	creatorImage: string;
	creatorName: string;
	creatorEmail: string;
	commentText: string;
	createdAt: string;
}

const Comment: React.FC<CommentProps> = ({
	creatorImage,
	creatorName,
	creatorEmail,
	commentText,
	createdAt,
}) => {
	return (
		<div className="flex items-start space-x-4 p-4 border-b border-gray-200">
			<img
				src={`/uploads/profileImage/${creatorImage}`}
				alt="creator-img"
				className="h-10 w-10 rounded-full"
				style={{ borderRadius: "50%" }}
			/>
			<div className="flex justify-between w-full">
				<div>
					<div className="flex items-center space-x-2">
						<h4 className="font-bold text-sm">{creatorName}</h4>
						<span className="text-sm text-xs">@{creatorEmail}</span>
					</div>
					<p className="text-sm">{commentText}</p>
				</div>
				<span className="text-xs">
					{new Date(createdAt).toLocaleString()}
				</span>
			</div>
		</div>
	);
};

export default Comment;
