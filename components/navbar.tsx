import { usePathname } from "next/navigation";

import {
	Bell,
	Briefcase,
	CalendarDays,
	ChartColumnIncreasing,
	Home,
	MessageSquareMore,
	Scroll,
	ScrollText,
	Settings,
	User,
} from "lucide-react";

export const NavItems = () => {
	const pathname = usePathname();

	function isNavItemActive(pathname: string, nav: string) {
		return pathname.includes(nav);
	}

	return [
		{
			name: "首頁",
			href: "/",
			icon: <Home size={20} />,
			active: pathname === "/",
			position: "top",
		},
		{
			name: "活動日曆",
			href: "/calendar",
			icon: <CalendarDays size={20} />,
			active: isNavItemActive(pathname, "/profile"),
			position: "top",
		},
		{
			name: "評估製作及管理",
			href: "/quizManagement",
			icon: <Scroll size={20} />,
			active: isNavItemActive(pathname, "/quizManagement"),
			position: "top",
		},
		{
			name: "己發佈的評估提交狀況",
			href: "/allQuizzes",
			icon: <ScrollText size={20} />,
			active: isNavItemActive(pathname, "/projects"),
			position: "top",
		},
		{
			name: "評估分析",
			href: "/quizAnalytics",
			icon: <ChartColumnIncreasing size={20} />,
			active: isNavItemActive(pathname, "/projects"),
			position: "top",
		},
		{
			name: "社交互動",
			href: "/social-page",
			icon: <MessageSquareMore size={20} />,
			active: isNavItemActive(pathname, "/social-page"),
			position: "top",
		},
		{
			name: "設定",
			href: "/settings",
			icon: <Settings size={20} />,
			active: isNavItemActive(pathname, "/settings"),
			position: "bottom",
		},
	];
};
