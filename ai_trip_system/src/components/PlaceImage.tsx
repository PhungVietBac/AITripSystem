import { useState, useEffect } from "react";
import Image from "next/image";
import { getCookie } from "cookies-next";

type PlaceImageProps = {
  idPlace: string;
  altText?: string;
  className?: string;
  width?: number;
  height?: number;
};

const PlaceImage = ({
  idPlace,
  altText = "Place image",
  className = "",
}: PlaceImageProps) => {
  const [imageUrl, setImageUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const token = getCookie("token");

  useEffect(() => {
    const fetchImage = async () => {
      setIsLoading(true);
      try {
        if (!idPlace) {
          setImageUrl("/images/elementor-placeholder-image.webp");
          return;
        }

        const imageRes = await fetch(
          `https://aitripsystem-api.onrender.com/api/v1/place_images/${idPlace}/random`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!imageRes.ok) {
          setImageUrl("/images/elementor-placeholder-image.webp");
          return;
        }

        const imageData = await imageRes.json();
        console.log("API Response:", imageData); // Log để xem cấu trúc dữ liệu
        setImageUrl(
          `https://aitripsystem-api.onrender.com/api/v1/proxy_image/?url=${encodeURIComponent(
            imageData.image
          )}`
        );
      } catch (err) {
        console.error("Lỗi khi fetch ảnh:", err);
        setImageUrl("/default.jpg");
      } finally {
        setIsLoading(false);
      }
    };

    fetchImage();
  }, [idPlace, token]);

  useEffect(() => {
    console.log("Image URL:", imageUrl);
  }, [imageUrl]);

  return (
    <div className={`relative w-full h-full ${className}`}>
      {isLoading ? (
        <div className="w-full h-full flex items-center justify-center bg-gray-100">
          <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <Image
          src={imageUrl}
          alt={altText}
          className="w-full h-full object-cover"
          loading="lazy"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      )}
    </div>
  );
};

export default PlaceImage;
