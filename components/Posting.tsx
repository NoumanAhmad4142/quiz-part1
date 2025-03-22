import { AddPhotoAlternateOutlined } from "@mui/icons-material";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface Post {
	creatorId: string;
	caption: string;
	tag: string;
	postPhoto: string | File[];
}

const Posting = ({
	post,
	apiEndpoint,
}: {
	post: Post;
	apiEndpoint: string;
}) => {
	const {
		register,
		handleSubmit,
		watch,
		setValue,
		formState: { errors },
	} = useForm({
		defaultValues: post,
	});

	const { data: session, status } = useSession();
	const router = useRouter();

	// Set initial values for the form fields
	useEffect(() => {
		setValue("caption", post.caption);
		setValue("tag", post.tag);
		setValue("postPhoto", post.postPhoto);
	}, [post, setValue]);

	const handlePublish = async (data: Post) => {
		try {
			const postForm = new FormData();

			// Ensure creatorId is correctly set from session
			const creatorId = session?.user?.id || data.creatorId;
			postForm.append("creatorId", creatorId);
			postForm.append("caption", data.caption);
			postForm.append("tag", data.tag);

			if (typeof data.postPhoto !== "string") {
				postForm.append("postPhoto", data.postPhoto[0]);
			} else {
				postForm.append("postPhoto", data.postPhoto);
			}
			console.log(postForm);
			console.log(apiEndpoint);

			const response = await fetch(apiEndpoint, {
				method: "POST",
				body: postForm,
			});
			if (response.ok) {
				console.log("Post published");
				toast.success("Post published");
				router.push(`/profile/${creatorId}/posts`);
			} else {
				const errorData = await response.json();
				console.error("Error creating post:", errorData);
			}
		} catch (err) {
			console.log(err);
		}
	};

	// Use watch to monitor the value of the postPhoto field
	const postPhoto = watch("postPhoto");

	return (
		<form
			className="flex flex-col gap-7 pb-24"
			onSubmit={handleSubmit(handlePublish)}
		>
			<label
				htmlFor="photo"
				className="flex gap-4 items-center cursor-pointer"
			>
				{postPhoto && postPhoto.length > 0 ? (
					typeof postPhoto === "string" ? (
						<Image
							src={postPhoto as string}
							alt="post"
							width={250}
							height={200}
							className="object-cover rounded-lg"
						/>
					) : (
						<Image
							src={URL.createObjectURL(postPhoto[0] as File)}
							alt="post"
							width={250}
							height={200}
							className="object-cover rounded-lg"
						/>
					)
				) : (
					<AddPhotoAlternateOutlined sx={{ fontSize: "100px" }} />
				)}
				<p>Upload a photo</p>
			</label>
			<input
				{...register("postPhoto", {
					validate: (value) => {
						if (
							value === null ||
							(Array.isArray(value) && value.length === 0) ||
							value === "undefined"
						) {
							return "A photo is required!";
						}
						return true;
					},
				})}
				id="photo"
				type="file"
				style={{ display: "none" }}
			/>
			{errors.postPhoto && (
				<p className="text-red-500">
					{String(errors.postPhoto.message)}
				</p>
			)}

			<div>
				<label htmlFor="caption" className="text-bold w-full">
					Caption
				</label>
				<hr />
				<textarea
					{...register("caption", {
						required: "Caption is required",
						validate: (value) => {
							if (value.length < 3) {
								return "Caption must be more than 2 characters";
							}
						},
					})}
					rows={3}
					placeholder="What's on your mind?"
					className="w-200 input border border-indigo-500 rounded-lg p-2"
					id="caption"
				/>

				{errors.caption?.message && (
					<p className="text-red-500">
						{String(errors.caption.message)}
					</p>
				)}
			</div>

			<div>
				<label htmlFor="tag" className="text-light-1">
					Tag
				</label>
				<hr />
				<input
					{...register("tag", { required: "Tag is required" })}
					type="text"
					placeholder="#tag"
					className="w-200 input border border-indigo-500 rounded-lg p-2"
				/>

				{errors.tag && (
					<p className="text-red-500">{String(errors.tag.message)}</p>
				)}
			</div>

			<button
				type="submit"
				className="w-200 py-2.5 rounded-lg mt-10 bg-indigo-600 hover:bg-indigo-700 font-semibold text-lg text-center text-white"
			>
				Publish
			</button>
		</form>
	);
};

export default Posting;
