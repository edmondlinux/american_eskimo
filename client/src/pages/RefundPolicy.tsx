import * as React from "react";
import { Seo } from "@/components/Seo";
import { SiteShell } from "@/components/SiteShell";
import { SectionHeading } from "@/components/SectionHeading";
import { Separator } from "@/components/ui/separator";

export default function RefundPolicy() {
  return (
    <SiteShell>
      <Seo
        title="Refund Policy — American Eskimo Puppies"
        description="Read our refund policy for American Eskimo Puppies. Clear terms, responsible placements, and a commitment to health and transparency."
      />

      <div className="surface-card grain-overlay rounded-[2rem] border border-border/70 p-6 sm:p-10">
        <SectionHeading
          eyebrow="Policy"
          title="Refund Policy"
          description="At American Eskimo Puppies, we are committed to providing healthy, happy, and well-socialized puppies. Our goal is to ensure that every family is completely satisfied with their new companion. Please review our refund policy below before placing a deposit or completing a purchase."
          data-testid="refund-heading"
        />

        <Separator className="my-8" />

        <div className="prose prose-sm sm:prose-base max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-p:text-muted-foreground prose-li:text-muted-foreground">

          <h3>Eligibility for a Refund</h3>
          <ul>
            <li>A refund request must be submitted within 30 days of the original purchase date.</li>
            <li>The puppy must be returned in good overall health.</li>
            <li>The puppy must not have suffered injury, neglect, or improper care after leaving our facility.</li>
            <li>All original paperwork (health records, vaccination records, and related documents) must be returned.</li>
          </ul>

          <h3>Refund Process</h3>
          <ol>
            <li>Email us at americaneskimopuppiesforsale@gmail.com with your order details and reason for return.</li>
            <li>Our team will review your request and provide return instructions.</li>
            <li>The puppy must be returned for health evaluation as directed.</li>
            <li>Once eligibility is confirmed, refunds will be issued to the original payment method within 5–7 business days.</li>
          </ol>

          <h3>Refund Amount</h3>
          <p>
            Approved refunds cover the full purchase price of the puppy, excluding any shipping,
            delivery, or handling fees.
          </p>

          <h3>Non-Refundable Situations</h3>
          <ul>
            <li>Puppies that contract illness after leaving our care.</li>
            <li>Puppies that sustain injuries due to accidents or improper handling.</li>
            <li>Failure to follow recommended veterinary care or vaccination schedules.</li>
          </ul>

          <h3>Health Guarantee</h3>
          <p>
            We stand behind the health and quality of our American Eskimo puppies and provide a
            written health guarantee at the time of purchase. If a licensed veterinarian identifies
            a serious health condition within the agreed evaluation period, we will work with you
            toward a fair resolution, which may include a replacement puppy, partial refund,
            or other appropriate remedy.
          </p>

          <h3>Cancellations and Transfers</h3>
          <p>
            Deposits are generally non-refundable, as they reserve a place in our planning and
            matching process. However, if we are unable to provide a suitable puppy match, we
            may offer a refund or allow a transfer to a future litter at our discretion.
          </p>

          <h3>Contact</h3>
          <p>
            If you have any questions regarding this policy, please contact us at americaneskimopuppiesforsale@gmail.com We are committed to responsible placements,
            transparency, and providing excellent customer support throughout your adoption journey.
          </p>
        </div>
      </div>
    </SiteShell>
  );
}