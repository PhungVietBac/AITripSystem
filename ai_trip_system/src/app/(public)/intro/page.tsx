import Feature from "./Feature";
import HeroSections from "./herosection";
import About from "./About";
import Members from "./members";
import Instruction from "./Instruction";
import Image from "next/image";

export default function IntroPage() {
  return (
    <div className="bg-gradient-to-r from-[#000080] to-[#00BFFF] min-h-screen relative">
      <HeroSections />

      {/* Starfish decorations between Hero and About */}
      <div className="relative h-16">
        <div className="absolute top-2 -left-5 z-10">
          <Image
            src="/images/saobien.png"
            alt="Sao biển"
            className="w-56 h-56 opacity-70 animate-pulse"
            width={500}
            height={500}
          />
        </div>
        <div className="absolute -top-24 right-20 z-10">
          <Image
            src="/images/saobien.png"
            alt="Sao biển"
            className="w-36 h-36 opacity-50 animate-bounce"
            style={{ animationDelay: "1s" }}
            width={500}
            height={500}
          />
        </div>
      </div>

      <About />
      <Feature />
      <Members />
      <Instruction />
    </div>
  );
}
