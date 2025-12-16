/*import { ImageWithFallback } from "./figma/imageWithFallback";

interface Image {
  id: number;
  url: string;
  alt: string;
}

interface InfiniteCarouselProps {
  images: Image[];
  speed?: number;
}

export function InfiniteCarousel({ images, speed = 30 }: InfiniteCarouselProps) {
  // Duplicamos las imágenes para crear el efecto infinito
  const duplicatedImages = [...images, ...images];

  return (
    <div className="relative overflow-hidden w-full">
      <div className="flex gap-6 animate-scroll" style={{
        animationDuration: `${speed}s`
      }}>
        {duplicatedImages.map((image, index) => (
          <div
            key={`${image.id}-${index}`}
            className="flex-shrink-0 w-80 h-64 rounded-xl overflow-hidden shadow-xl"
          >
            <ImageWithFallback
              src={image.url}
              alt={image.alt}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
*/
      {/* Gradientes laterales para efecto de fade 
      <div className="absolute top-0 left-0 h-full w-32 bg-gradient-to-r from-gray-950 to-transparent pointer-events-none" />
      <div className="absolute top-0 right-0 h-full w-32 bg-gradient-to-l from-gray-950 to-transparent pointer-events-none" />
      
      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-scroll {
          animation: scroll linear infinite;
        }

        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}*/}
