import Contents from "./contents";
import HeroSections from "./herosection";
import Features from "./features";
import Members from "./members";

export default function IntroPage() {
  return (
    <>
      <HeroSections />
      <Features />
      <Contents />
      <Members />
    </>
  );
}