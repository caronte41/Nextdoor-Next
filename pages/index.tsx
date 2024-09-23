import Image from "next/image";
import localFont from "next/font/local";
import { Combobox_Custom } from "@/nextdoor/components/Combobox_Custom";
import { Input_Custom } from "@/nextdoor/components/Input_Custom";
import MainLayout from "@/nextdoor/layouts/MainLayout";

const items = [
  { value: "next.js", label: "Next.js" },
  { value: "sveltekit", label: "SvelteKit" },
  { value: "nuxt.js", label: "Nuxt.js" },
  { value: "remix", label: "Remix" },
  { value: "astro", label: "Astro" },
];

export default function Home() {
  const handleSelect = (selectedValue: string) => {
    console.log("Selected item:", selectedValue);
  };
  return (
    <div>
      <Combobox_Custom
        items={items}
        onSelect={handleSelect}
        placeholder="Select framework..."
      />
      <Input_Custom />
    </div>
  );
}

Home.Layout = MainLayout;
