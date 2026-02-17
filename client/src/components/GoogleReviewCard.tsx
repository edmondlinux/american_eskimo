import * as React from "react";
import { StarRating } from "@/components/StarRating";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import googleLogo from "@/assets/google-logo.png";

function GoogleLogo() {
  return (
    <div className="flex items-center justify-center mb-2">
      <img
        src={googleLogo}
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
    text: "We brought home our American Eskimo puppy three weeks ago and honestly, we can’t imagine life without him now. He’s playful, super smart, and already learning commands so quickly. The whole process felt personal and stress-free. They answered every question we had (and we had a lot!).",
    rating: 5,
  },
  {
    id: 2,
    author: "Sarah Jenkins",
    text: "Our American Eskimo is the happiest little dog. You can tell she was raised with care — she adjusted to our home almost instantly. She’s fluffy, confident, and great with our kids. The communication throughout was clear and reassuring.",
    rating: 5,
  },
  {
    id: 3,
    author: "Robert T.",
    text: "From the first message to pickup day, everything was smooth. Our American Eskimo puppy is healthy, full of personality, and already very well socialized. He loves everyone he meets. You can tell they prioritize temperament.",
    rating: 5,
  },
  {
    id: 4,
    author: "Emily R.",
    text: "I was nervous about getting my first dog, but choosing an American Eskimo from here was the best decision. She came home confident and already used to basic routines. She’s affectionate but also independent in the cutest way.",
    rating: 5,
  },
  {
    id: 5,
    author: "Daniel M.",
    text: "Our American Eskimo has so much personality packed into that fluffy white coat. He’s alert, playful, and incredibly loyal. We appreciated all the updates and photos before pickup day. It made us feel involved the whole time.",
    rating: 5,
  },
  {
    id: 6,
    author: "Laura & Ben K.",
    text: "We did a lot of research before choosing an American Eskimo, and we’re so glad we found this breeder. Our puppy is well-adjusted and very intelligent. Potty training has been much easier than we expected!",
    rating: 5,
  },
  {
    id: 7,
    author: "Michelle D.",
    text: "I’ve owned dogs before, but this American Eskimo is something special. So bright, so loving, and absolutely gorgeous. The entire experience felt professional but still warm and personal.",
    rating: 5,
  },
  {
    id: 8,
    author: "Chris P.",
    text: "Our little American Eskimo settled in within days. He’s playful but not overly hyper, and he bonds closely with the family. We felt supported even after bringing him home, which meant a lot.",
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