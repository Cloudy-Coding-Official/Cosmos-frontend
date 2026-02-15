const PARTNERS = [
  { name: "Stellar", logo: "/logos/stellar.svg", style: { height: "60px" } },
  { name: "Cosmos", logo: "/logos/cosmos.svg", style: { height: "60px" } },
  { name: "Horizon", logo: "/logos/horizon.svg", style: { height: "60px" } },
  { name: "Atlas", logo: "/logos/atlas.svg", style: { height: "60px" } },
  { name: "Nova", logo: "/logos/nova.svg", style: { height: "60px" } },
  { name: "Mercury", logo: "/logos/mercury.svg", style: { height: "60px" } },
  { name: "Luna", logo: "/logos/luna.svg", style: { height: "60px" } },
  { name: "Orbit", logo: "/logos/orbit.svg", style: { height: "60px" }},
];

export function PartnerLogos() {
  return (
    <div className="pb-10 overflow-hidden">
    <div className="p-4 md:p-8">
      <div className="relative">
        <style>{`
          @keyframes scroll {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-33.333%);
            }
          }
          .scrolling-partners {
            animation: scroll 30s linear infinite;
            display: flex;
            width: fit-content;
          }
          .scrolling-partners:hover {
            animation-play-state: paused;
          }
          @keyframes scrollReverse {
            0% {
              transform: translateX(-33.333%);
            }
            100% {
              transform: translateX(0);
            }
          }
          .scrolling-certifications {
            animation: scrollReverse 25s linear infinite;
            display: flex;
            width: fit-content;
          }
          .scrolling-certifications:hover {
            animation-play-state: paused;
          }
        `}</style>
        <div className="scrolling-partners">
          {PARTNERS.map((partner, index) => (
            <div
              key={`${partner.name}-${index}`}
              className="flex-shrink-0 flex justify-center items-center px-6 md:px-12 md:min-w-[200px]"
            >
              <img
                src={partner.logo || "/placeholder.svg"}
                alt={partner.name}
                style={partner.style}
                className="h-6 sm:h-8 md:h-12 w-auto opacity-70 hover:opacity-100 transition-all duration-200 filter grayscale hover:grayscale-0"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
  );
}
