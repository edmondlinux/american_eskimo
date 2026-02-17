import * as React from "react";
import { Seo } from "@/components/Seo";
import { SiteShell } from "@/components/SiteShell";
import { SectionHeading } from "@/components/SectionHeading";
import { Separator } from "@/components/ui/separator";

export default function Terms() {
  return (
    <SiteShell>
      <Seo
        title="Terms of Service — American Eskimo Puppies"
        description="Review the Terms of Service for American Eskimo Puppies. Clear guidelines, responsible placements, and legal protections."
      />

      <div className="surface-card grain-overlay rounded-[2rem] border border-border/70 p-6 sm:p-10">
        <SectionHeading
          eyebrow="Legal"
          title="Terms of Service"
          description="These Terms of Service govern your use of our website and the purchase of puppies from American Eskimo Puppies. By accessing this site or placing a deposit, you agree to the terms outlined below."
          data-testid="terms-heading"
        />

        <Separator className="my-8" />

        <div className="prose prose-sm sm:prose-base max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-p:text-muted-foreground prose-li:text-muted-foreground">

          <h3>Use of Website</h3>
          <p>
            This website is provided for informational purposes regarding available American Eskimo puppies and related services. 
            We reserve the right to update, modify, or remove content at any time without prior notice. 
            Availability of puppies, pricing, and timelines are subject to change.
          </p>

          <h3>Eligibility</h3>
          <p>
            By using this website or purchasing a puppy, you confirm that you are at least 18 years of age 
            and legally able to enter into a binding agreement.
          </p>

          <h3>Deposits and Payments</h3>
          <p>
            Deposits are required to reserve a puppy and are generally non-refundable unless otherwise stated 
            in our Refund Policy. Full payment terms, delivery arrangements, and pickup details will be provided 
            prior to finalizing a purchase.
          </p>

          <h3>Health and Care Responsibility</h3>
          <p>
            Once a puppy leaves our care, the buyer assumes full responsibility for the puppy’s health, safety, 
            and well-being. Buyers agree to provide proper veterinary care, nutrition, housing, and humane treatment.
          </p>

          <h3>Right to Refuse Service</h3>
          <p>
            We reserve the right to decline or cancel any inquiry, deposit, or sale if we determine 
            that the placement would not be in the best interest of the puppy.
          </p>

          <h3>Intellectual Property</h3>
          <p>
            All content on this website, including text, images, branding, and design elements, 
            is the property of American Eskimo Puppies and may not be copied, reproduced, 
            or used for commercial purposes without written permission.
          </p>

          <h3>Limitation of Liability</h3>
          <p>
            To the fullest extent permitted by law, American Eskimo Puppies shall not be liable 
            for any indirect, incidental, or consequential damages arising from the use of this website 
            or the purchase of a puppy, beyond the remedies outlined in our written agreements and policies.
          </p>

          <h3>Policy Updates</h3>
          <p>
            We may update these Terms of Service at any time. Continued use of the website 
            constitutes acceptance of any revisions.
          </p>

          <h3>Contact</h3>
          <p>
            If you have any questions regarding these Terms of Service, please contact us 
            through our website contact page or via our official business email.
          </p>

        </div>
      </div>
    </SiteShell>
  );
}