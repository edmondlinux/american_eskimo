import * as React from "react";
import { StarRating } from "@/components/StarRating";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

function GoogleLogo() {
  return (
    <div className="flex items-center justify-center mb-2">
      <img
        src="/google-logo.png"
        alt="Google Logo"
        className="h-12 w-auto select-none"
      />
    </div>
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