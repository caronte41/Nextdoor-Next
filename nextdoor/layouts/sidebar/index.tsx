import Button_Custom from "@/nextdoor/components/Button_Custom";
import Routes from "@/nextdoor/helpers/constants/route";
import { BlackHole01Icon } from "@/nextdoor/icons/BlackHoleIcon";
import { DiscoverCircleIcon } from "@/nextdoor/icons/DiscoverIcon";
import { Home11Icon } from "@/nextdoor/icons/HomeIcon";
import { Notification01Icon } from "@/nextdoor/icons/NotificationIcon";
import Link from "next/link";

export default function Sidebar() {
  const sidebarItems = [
    { linkTo: Routes.anasayfa, title: "Anasayfa", icon: <Home11Icon /> },
    { linkTo: Routes.discover, title: "Keşfet", icon: <Notification01Icon /> },
    {
      linkTo: Routes.notifications,
      title: "Bildirimler",
      icon: <BlackHole01Icon />,
    },
    {
      linkTo: Routes.events,
      title: "Etkinlikler",
      icon: <DiscoverCircleIcon />,
    },
  ];

  return (
    <div className="px-3 ml-4 py-4 overflow-y-auto flex flex-col justify-between mt-16 fixed top-0 left-0 z-40 w-64 h-[calc(100vh-75px)]">
      <div className="space-y-4 mb-4">
        {" "}
        {/* This ensures space between sidebar items */}
        {sidebarItems.map((item) => (
          <Link key={item.linkTo} href={item.linkTo} passHref>
            <Button_Custom
              variant="ghost"
              className="w-full mb-4 justify-start text-lg"
            >
              <div className="flex items-center">
                <span className="mr-4 text-2xl">{item.icon}</span>{" "}
                {/* Larger icon with margin */}
                <span>{item.title}</span>
              </div>
            </Button_Custom>
          </Link>
        ))}
      </div>
    </div>
  );
}
