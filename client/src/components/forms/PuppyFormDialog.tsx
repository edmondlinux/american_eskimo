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
import { apiRequest } from "@/lib/queryClient";
import { Upload, X, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

function withCoercion() {
  return insertPuppySchema.extend({
    price: z.coerce.number().int().min(0),
    isAvailable: z.coerce.boolean().optional(),
    imageUrl: z.string().optional().nullable(),
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
  imageUrl: string | null;
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
  imageUrl: null,
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
  const [isUploading, setIsUploading] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

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
        imageUrl: puppy.imageUrl ?? null,
      });
    } else {
      setState(emptyState);
    }
  }, [open, mode, puppy]);

  const pending = create.isPending || update.isPending || isUploading;

  async function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      setState((s) => ({ ...s, imageUrl: data.url }));
      toast({ title: "Image uploaded", description: "Puppy photo has been saved." });
    } catch (err: any) {
      toast({
        title: "Upload failed",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    const schema = withCoercion();
    const parsed = schema.safeParse({
      ...state,
      price: state.price,
      isAvailable: state.isAvailable,
      imageUrl: state.imageUrl,
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
              {/* Image Upload Field */}
              <div className="md:col-span-2 space-y-2">
                <Label>Puppy Photo</Label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className={cn(
                    "relative aspect-video w-full rounded-2xl border-2 border-dashed border-border/70 bg-secondary/20 flex flex-col items-center justify-center cursor-pointer hover:bg-secondary/30 transition-all overflow-hidden",
                    state.imageUrl && "border-none"
                  )}
                >
                  {state.imageUrl ? (
                    <>
                      <img src={state.imageUrl} alt="Puppy preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                        <p className="text-white text-sm font-medium">Click to change photo</p>
                      </div>
                      <Button
                        type="button"
                        size="icon"
                        variant="destructive"
                        className="absolute top-2 right-2 rounded-full h-8 w-8 shadow-lg"
                        onClick={(e) => {
                          e.stopPropagation();
                          setState(s => ({ ...s, imageUrl: null }));
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <div className="flex flex-col items-center gap-2 p-6 text-center">
                      <div className="h-12 w-12 rounded-full bg-secondary/50 flex items-center justify-center">
                        {isUploading ? (
                          <div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Upload className="h-6 w-6 text-muted-foreground" />
                        )}
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Click to upload puppy photo</p>
                        <p className="text-xs text-muted-foreground">JPG, PNG or JPEG (max 5MB)</p>
                      </div>
                    </div>
                  )}
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*"
                    onChange={onFileChange}
                    disabled={isUploading}
                  />
                </div>
              </div>

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
