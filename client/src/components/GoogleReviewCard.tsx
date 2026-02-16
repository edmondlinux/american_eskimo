import * as React from "react";
import { cn } from "@/lib/utils";
import { StarRating } from "@/components/StarRating";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

const GOOGLE_COLORS = {
  blue: "#4285F4",
  red: "#EA4335",
  yellow: "#FBBC05",
  green: "#34A853",
};

function GoogleLogo() {
  return (
    <div className="flex items-center justify-center gap-[2px] text-3xl font-bold tracking-tight select-none mb-2">
      <span style={{ color: GOOGLE_COLORS.blue }}>G</span>
      <span style={{ color: GOOGLE_COLORS.red }}>o</span>
      <span style={{ color: GOOGLE_COLORS.yellow }}>o</span>
      <span style={{ color: GOOGLE_COLORS.blue }}>g</span>
      <span style={{ color: GOOGLE_COLORS.green }}>l</span>
      <span style={{ color: GOOGLE_COLORS.red }}>e</span>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6">
      <path
        fill={GOOGLE_COLORS.blue}
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill={GOOGLE_COLORS.green}
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill={GOOGLE_COLORS.yellow}
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
      />
      <path
        fill={GOOGLE_COLORS.red}
        d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

const REVIEWS = [
  {
    id: 1,
    author: "Mark & Julia W.",
    text: "We are so glad we found this website! Our corgi puppy is the sweetest, most energetic puppy we could ask for. The team was very helpful and gave us all the information we needed. We are beyond happy with our new addition!",
    rating: 5,
  },
  {
    id: 2,
    author: "Sarah Jenkins",
    text: "Professional and caring breeder. Our Golden Retriever is healthy and well-socialized. Highly recommend to anyone looking for a high-quality companion.",
    rating: 5,
  },
  {
    id: 3,
    author: "Robert T.",
    text: "Clear communication from start to finish. You can tell they really love their dogs and put temperament first. Our new puppy has integrated perfectly into our home.",
    rating: 5,
  },
  {
    id: 4,
    author: "Emily R.",
    text: "The best experience I've had with a breeder. They provided everything we needed for the transition. Our little guy is thriving!",
    rating: 5,
  },
];

export function GoogleReviewCard() {
  return (
    <div className="py-12 px-6">
      <div className="flex flex-col items-center mb-10 text-center">
        <GoogleLogo />
        <StarRating rating={5} className="my-2" />
        <p className="text-xl font-bold mt-2">Based on 156+ Reviews</p>
      </div>

      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="mx-auto w-full max-w-xl"
      >
        <CarouselContent>
          {REVIEWS.map((review) => (
            <CarouselItem key={review.id}>
              <div className="p-1">
                <div className="rounded-[2rem] border border-border/70 bg-card p-8 shadow-sm">
                  <div className="mb-6">
                    <GoogleIcon />
                  </div>
                  <p className="text-lg leading-relaxed text-foreground mb-6">
                    {review.text}
                  </p>
                  <p className="font-semibold text-muted-foreground">
                    {review.author}
                  </p>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="flex justify-center gap-2 mt-8">
          <CarouselPrevious className="relative translate-y-0 left-0" />
          <CarouselNext className="relative translate-y-0 right-0" />
        </div>
      </Carousel>
    </div>
  );
}
