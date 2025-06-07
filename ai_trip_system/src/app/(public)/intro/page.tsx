import Feature from "./Feature";
import HeroSections from "./herosection";
import About from "./About";
import Members from "./Members";
import Instruction from "./Instruction";

export default function IntroPage() {
  return (
    <div className="bg-gradient-to-r from-[#000080] to-[#00BFFF] min-h-screen relative">
      <HeroSections />

      {/* Starfish decorations between Hero and About */}
      <div className="relative h-16">
        <div className="absolute top-2 -left-5 z-10">
          <img
            src="/images/saobien.png"
            alt="Sao biển"
            className="w-56 h-56 opacity-70 animate-pulse"
          />
        </div>
        <div className="absolute -top-24 right-20 z-10">
          <img
            src="/images/saobien.png"
            alt="Sao biển"
            className="w-36 h-36 opacity-50 animate-bounce"
            style={{ animationDelay: '1s' }}
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
