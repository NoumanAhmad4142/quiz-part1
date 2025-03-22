import SocialContainer from "@/components/social-container";
import RightSideBar from "@/components/social-rightsidebar";
import TopBar from "@/components/topbar";
import React from "react";

const SocialPage = () => {
	return (
		<div>
			<main className="flex flex-row">
				<SocialContainer />
				<RightSideBar />
			</main>
		</div>
	);
};

export default SocialPage;
