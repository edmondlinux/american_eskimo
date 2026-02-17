import * as React from "react";
import { SectionHeading } from "@/components/SectionHeading";
import momDadImg from "@/assets/mom-dad.jpeg";
import momLittersImg from "@/assets/mom-litters.jpeg";

export function LineageSection() {
  return (
    <section className="mt-14" data-testid="lineage-section">
      <SectionHeading
        eyebrow="The Heritage"
        title="Our Lineage"
        description="Meet the dedicated parents and see our past litters. We take pride in the health and temperament of our breeding lines."
        data-testid="lineage-heading"
      />
      
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="group relative overflow-hidden rounded-[2rem] border border-border/70 bg-card surface-card transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]">
          <div className="aspect-[16/9] overflow-hidden bg-secondary/20">
            <img 
              src={momDadImg} 
              alt="Mom and Dad" 
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
          </div>
          <div className="absolute bottom-0 left-0 p-6 text-white">
            <h3 className="text-xl font-semibold">The Parents</h3>
            <p className="mt-1 text-sm text-white/80">Mom & Dad — Hand-selected for health and temperament.</p>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-[2rem] border border-border/70 bg-card surface-card transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]">
          <div className="aspect-[16/9] overflow-hidden bg-secondary/20">
            <img 
              src={momLittersImg} 
              alt="Mom and Litters" 
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
          </div>
          <div className="absolute bottom-0 left-0 p-6 text-white">
            <h3 className="text-xl font-semibold">The Litters</h3>
            <p className="mt-1 text-sm text-white/80">Nurtured with care from day one.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
