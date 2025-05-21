import Contents from "@/components/contents";
import HeroSections from "@/app/intro/herosection";
import Features from "@/components/features";
import Members from "@/components/members";

export default function IntroPage() {
  return (
    <div className="bg-gradient-to-r from-[#000080] to-[#00BFFF] min-h-screen">
      <HeroSections />
      <Features />
      <Contents />
      <Members />
    </div>
  );
}