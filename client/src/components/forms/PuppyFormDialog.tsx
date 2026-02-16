import * as React from "react";
import { z } from "zod";
import type { Puppy } from "@shared/schema";
import { insertPuppySchema } from "@shared/schema";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useCreatePuppy, useUpdatePuppy } from "@/hooks/use-puppies";

function withCoercion() {
  return insertPuppySchema.extend({
    price: z.coerce.number().int().min(0),
    isAvailable: z.coerce.boolean().optional(),
  });
}

type FormState = {
  name: string;
  breed: string;
  sex: string;
  age: string;
  temperament: string;
  price: string;
  shortDescription: string;
  description: string;
  isAvailable: boolean;
};

const emptyState: FormState = {
  name: "",
  breed: "",
  sex: "",
  age: "",
  temperament: "",
  price: "",
  shortDescription: "",
  description: "",
  isAvailable: true,
};

export function PuppyFormDialog({
  open,
  onOpenChange,
  mode,
  puppy,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  mode: "create" | "edit";
  puppy?: Puppy | null;
}) {
  const { toast } = useToast();
  const create = useCreatePuppy();
  const update = useUpdatePuppy();

  const [state, setState] = React.useState<FormState>(emptyState);

  React.useEffect(() => {
    if (!open) return;
    if (mode === "edit" && puppy) {
      setState({
        name: puppy.name ?? "",
        breed: puppy.breed ?? "",
        sex: puppy.sex ?? "",
        age: puppy.age ?? "",
        temperament: puppy.temperament ?? "",
        price: String(puppy.price ?? ""),
        shortDescription: puppy.shortDescription ?? "",
        description: puppy.description ?? "",
        isAvailable: !!puppy.isAvailable,
      });
    } else {
      setState(emptyState);
    }
  }, [open, mode, puppy]);

  const pending = create.isPending || update.isPending;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    const schema = withCoercion();
    const parsed = schema.safeParse({
      ...state,
      price: state.price,
      isAvailable: state.isAvailable,
    });

    if (!parsed.success) {
      const first = parsed.error.errors[0];
      toast({
        title: "Please check the form",
        description: `${first.path.join(".") || "field"}: ${first.message}`,
        variant: "destructive",
      });
      return;
    }

    try {
      if (mode === "create") {
        await create.mutateAsync(parsed.data);
        toast({ title: "Puppy listing created", description: "Your new listing is now saved." });
      } else {
        if (!puppy?.id) throw new Error("Missing puppy id");
        // Partial updates allowed:
        await update.mutateAsync({ id: puppy.id, updates: parsed.data });
        toast({ title: "Listing updated", description: "Changes have been saved." });
      }
      onOpenChange(false);
    } catch (err: any) {
      toast({
        title: "Something went wrong",
        description: err?.message ?? "Please try again.",
        variant: "destructive",
      });
    }
  }

  const title = mode === "create" ? "New Puppy Listing" : "Edit Listing";
  const desc =
    mode === "create"
      ? "Add a new puppy to the shop. Keep descriptions warm, precise, and honest."
      : "Refine details. Small edits can make a big difference in clarity.";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl rounded-3xl border-border/70 p-0 overflow-hidden flex flex-col max-h-[90vh]">
        <div className="bg-gradient-to-br from-secondary/70 via-card to-card p-6 flex-shrink-0">
          <DialogHeader>
            <DialogTitle className="text-2xl">{title}</DialogTitle>
            <DialogDescription className="text-muted-foreground">{desc}</DialogDescription>
          </DialogHeader>
        </div>

        <ScrollArea className="flex-1 overflow-y-auto">
          <form onSubmit={onSubmit} className="p-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={state.name}
                  onChange={(e) => setState((s) => ({ ...s, name: e.target.value }))}
                  className="rounded-xl"
                  placeholder="e.g., Maple"
                  data-testid="puppy-form-name"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="breed">Breed</Label>
                <Input
                  id="breed"
                  value={state.breed}
                  onChange={(e) => setState((s) => ({ ...s, breed: e.target.value }))}
                  className="rounded-xl"
                  placeholder="e.g., Golden Retriever"
                  data-testid="puppy-form-breed"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="sex">Sex</Label>
                <Input
                  id="sex"
                  value={state.sex}
                  onChange={(e) => setState((s) => ({ ...s, sex: e.target.value }))}
                  className="rounded-xl"
                  placeholder="Male / Female"
                  data-testid="puppy-form-sex"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  value={state.age}
                  onChange={(e) => setState((s) => ({ ...s, age: e.target.value }))}
                  className="rounded-xl"
                  placeholder="e.g., 10 weeks"
                  data-testid="puppy-form-age"
                />
              </div>

              <div className="grid gap-2 md:col-span-2">
                <Label htmlFor="temperament">Temperament</Label>
                <Input
                  id="temperament"
                  value={state.temperament}
                  onChange={(e) => setState((s) => ({ ...s, temperament: e.target.value }))}
                  className="rounded-xl"
                  placeholder="Calm · Confident · People-focused"
                  data-testid="puppy-form-temperament"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="price">Adoption Fee (USD)</Label>
                <Input
                  id="price"
                  inputMode="numeric"
                  value={state.price}
                  onChange={(e) => setState((s) => ({ ...s, price: e.target.value }))}
                  className="rounded-xl"
                  placeholder="e.g., 2400"
                  data-testid="puppy-form-price"
                />
              </div>

              <div className="flex items-center justify-between gap-4 rounded-2xl border border-border/70 bg-secondary/40 p-4 md:mt-6">
                <div>
                  <div className="text-sm font-semibold">Availability</div>
                  <div className="text-xs text-muted-foreground">
                    Toggle off if reserved or pending placement.
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-muted-foreground">{state.isAvailable ? "Available" : "Reserved"}</span>
                  <Switch
                    checked={state.isAvailable}
                    onCheckedChange={(v) => setState((s) => ({ ...s, isAvailable: v }))}
                    data-testid="puppy-form-available"
                  />
                </div>
              </div>

              <div className="grid gap-2 md:col-span-2">
                <Label htmlFor="shortDescription">Short Description</Label>
                <Textarea
                  id="shortDescription"
                  value={state.shortDescription}
                  onChange={(e) => setState((s) => ({ ...s, shortDescription: e.target.value }))}
                  className="min-h-[88px] rounded-2xl"
                  placeholder="A one-paragraph introduction — quick, warm, specific."
                  data-testid="puppy-form-short"
                />
              </div>

              <div className="grid gap-2 md:col-span-2">
                <Label htmlFor="description">Full Description</Label>
                <Textarea
                  id="description"
                  value={state.description}
                  onChange={(e) => setState((s) => ({ ...s, description: e.target.value }))}
                  className="min-h-[140px] rounded-2xl"
                  placeholder="Detail temperament, routines, training progress, and best-fit home."
                  data-testid="puppy-form-description"
                />
              </div>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3">
              <Button
                type="button"
                variant="outline"
                className="rounded-xl"
                onClick={() => onOpenChange(false)}
                disabled={pending}
                data-testid="puppy-form-cancel"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={pending}
                className="rounded-xl bg-gradient-to-r from-primary to-primary/85 text-primary-foreground shadow-md shadow-primary/20 hover:shadow-lg hover:-translate-y-0.5 transition-all btn-sheen"
                data-testid="puppy-form-submit"
              >
                {pending ? "Saving..." : mode === "create" ? "Create listing" : "Save changes"}
              </Button>
            </div>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
