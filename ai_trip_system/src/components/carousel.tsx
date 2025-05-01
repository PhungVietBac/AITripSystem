"use client";
import Image from "next/image";
import { useState, useRef, useEffect, useCallback } from "react";
import Tab from "./tab";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";

type CarouselProps = {
  quantity: number;
};

const Carousel = ({ quantity }: CarouselProps) => {
  const images: string[] = Array(quantity).fill(
    "/images/hinh-nen-may-tinh.jpg"
  );
  const imageWidth = 300;
  const containerRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const touchStartX = useRef(0);
  const touchDeltaX = useRef(0);
  const [showInfo, setShowInfo] = useState(false);
  const [hasVisited, setHasVisited] = useState(false);

  // Responsive logic to determine how many images to show based on screen size
  const getVisibleCount = () => {
    if (typeof window === "undefined") return 3;
    if (window.innerWidth < 640) return 1;
    if (window.innerWidth < 1024) return 2;
    return 3;
  };

  const [visibleCount, setVisibleCount] = useState<number>(getVisibleCount());
  const maxIndex = Math.ceil(images.length / visibleCount);

  // Set the index to the maximum index if it exceeds the maximum index
  const goto = useCallback(
    (newIndex: number) => {
      setSelectedIndex(newIndex * visibleCount);
    },
    [visibleCount]
  );

  // Update the visible count on window resize
  useEffect(() => {
    const handleResize = () => {
      setVisibleCount(getVisibleCount());
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Update the container's transform style when the index changes
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.style.transform = `translateX(-${
        index * visibleCount * imageWidth
      }px)`;
    }
  }, [index, visibleCount]);

  // Handle touch events for mobile swipe functionality
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  // Handle touch move event to calculate the swipe distance
  const handleTouchMove = (e: React.TouchEvent) => {
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
  };

  // Handle touch end event to determine if the swipe was significant enough to change the index
  const handleTouchEnd = () => {
    if (touchDeltaX.current > 50) {
      goto(index - 1);
    } else if (touchDeltaX.current < -50) {
      goto(index + 1);
    }
    touchDeltaX.current = 0;
  };

  // Handle next and previous button clicks
  const handleNext = () => {
    const next = selectedIndex + 1;
    setSelectedIndex(next >= images.length ? 0 : next);
  };

  const handlePrev = () => {
    const prev = selectedIndex - 1;
    setSelectedIndex(prev < 0 ? images.length - 1 : prev);
  };

  useEffect(() => {
    setIndex(Math.floor(selectedIndex / visibleCount));
  }, [selectedIndex, visibleCount]);

  const handleClickImage = (idx: number) => {
    if (selectedIndex === idx) {
      setShowInfo((prev) => !prev);
    } else {
      setSelectedIndex(idx);
      setShowInfo(true);
    }
    setHasVisited(true);
  };

  return (
    <>
      <div className="px-10 py-3 relative">
        <div
          className="overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div
            ref={containerRef}
            className="flex gap-2 transition-transform duration-500 ease-in-out"
          >
            {images.map((src, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-[300px] h-[200px] relative rounded-md overflow-hidden"
                onClick={() => handleClickImage(i)}
              >
                <Image
                  src={src}
                  alt={`Image ${i}`}
                  fill
                  sizes="(max-width: 500px) 100vw, (max-width: 500px) 50vw, 33vw"
                  loading="lazy"
                  className={`object-cover hover:scale-105 hover:opacity-100 transition-transform duration-500 opacity-50 cursor-pointer ${
                    selectedIndex === i ? "opacity-100" : "opacity-50"
                  }`}
                />
              </div>
            ))}
          </div>
        </div>
        {images.length > visibleCount && (
          <>
            <div className="flex justify-center gap-2 mt-4">
              {Array.from({ length: maxIndex }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedIndex(i * visibleCount)}
                  className={`w-3 h-3 rounded-full cursor-pointer ${
                    i === index ? "bg-blue-500" : "bg-gray-300"
                  }`}
                ></button>
              ))}
            </div>

            <FaAngleLeft
              className="w-6 h-6 text-black rounded-md active:scale-50 absolute top-[100px] left-2 cursor-pointer"
              aria-hidden="true"
              onClick={() => handlePrev()}
            />

            <FaAngleRight
              className="w-6 h-6 text-black rounded-md active:scale-50 absolute top-[100px] right-2 cursor-pointer"
              aria-hidden="true"
              onClick={() => handleNext()}
            />
          </>
        )}
      </div>

      {hasVisited && (
        <div
          className={`p-4 bg-gray-50 rounded-lg transition-opacity duration-300 ${
            showInfo ? "opacity-100 block" : "opacity-0 hidden"
          }`}
        >
          <Tab />
        </div>
      )}
    </>
  );
};

export default Carousel;
