import Contents from "./contents";
import HeroSections from "./herosection";
import Features from "./features";
import Members from "./members";

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