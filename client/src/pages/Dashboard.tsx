import * as React from "react";
import { Link } from "wouter";
import { Seo } from "@/components/Seo";
import { SiteShell } from "@/components/SiteShell";
import { SectionHeading } from "@/components/SectionHeading";
import { useCurrentUser } from "@/hooks/use-auth";
import { usePuppies } from "@/hooks/use-puppies";
import { useInquiries } from "@/hooks/use-inquiries";
import { useReviews, useDeleteReview } from "@/hooks/use-reviews";
import { useDeletePuppy } from "@/hooks/use-puppies";
import { PuppyFormDialog } from "@/components/forms/PuppyFormDialog";
import { ReviewFormDialog } from "@/components/forms/ReviewFormDialog";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import type { Puppy, Review } from "@shared/schema";
import { Plus, Shield, Lock, Trash2, Pencil, Search, Inbox, PawPrint, Star, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSettings, useUpdateSetting } from "@/hooks/use-settings";

function SignInRequired() {
  return (
    <div className="surface-card grain-overlay rounded-[2rem] border border-border/70 p-8 sm:p-10 shadow-[var(--shadow-soft)]" data-testid="dashboard-signin-required">
      <div className="flex items-start gap-4">
        <div className="rounded-2xl border border-border/70 bg-secondary/60 p-3 shadow-sm">
          <Lock className="h-6 w-6 text-primary" />
        </div>
        <div className="min-w-0">
          <div className="text-2xl font-semibold" style={{ fontFamily: "var(--font-serif)" }}>
            Sign-in required
          </div>
          <div className="mt-2 text-sm text-muted-foreground">
            Please log in with an admin account to access the dashboard.
          </div>

          <Link href="/auth">
            <Button
              type="button"
              className="mt-6 rounded-xl bg-gradient-to-r from-primary to-primary/85 text-primary-foreground shadow-md shadow-primary/20 hover:shadow-lg hover:-translate-y-0.5 transition-all btn-sheen"
              data-testid="dashboard-login-link"
            >
              Go to Login
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { toast } = useToast();
  const meQ = useCurrentUser();
  const settingsQ = useSettings();
  const updateSetting = useUpdateSetting();
  const [contactPhone, setContactPhone] = React.useState("");

  React.useEffect(() => {
    if (settingsQ.data) {
      const phone = settingsQ.data.find((s: any) => s.key === "contact_phone")?.value;
      if (phone) setContactPhone(phone);
    }
  }, [settingsQ.data]);

  const handleUpdatePhone = async () => {
    try {
      await updateSetting.mutateAsync({ key: "contact_phone", value: contactPhone });
      toast({ title: "Settings updated", description: "Contact phone number has been updated." });
    } catch (err: any) {
      toast({ title: "Update failed", description: err.message, variant: "destructive" });
    }
  };

  const puppiesQ = usePuppies({ availableOnly: false });
  const inquiriesQ = useInquiries();
  const reviewsQ = useReviews();

  const deletePuppy = useDeletePuppy();
  const deleteReview = useDeleteReview();

  const user = meQ.data;
  const isAdmin = user?.role === "admin";

  const [tab, setTab] = React.useState<"puppies" | "inquiries" | "reviews" | "settings">("puppies");

  const [puppySearch, setPuppySearch] = React.useState("");
  const [reviewSearch, setReviewSearch] = React.useState("");

  const [puppyDialogOpen, setPuppyDialogOpen] = React.useState(false);
  const [puppyDialogMode, setPuppyDialogMode] = React.useState<"create" | "edit">("create");
  const [selectedPuppy, setSelectedPuppy] = React.useState<Puppy | null>(null);

  const [reviewDialogOpen, setReviewDialogOpen] = React.useState(false);
  const [reviewDialogMode, setReviewDialogMode] = React.useState<"create" | "edit">("create");
  const [selectedReview, setSelectedReview] = React.useState<Review | null>(null);

  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [confirmCtx, setConfirmCtx] = React.useState<{ kind: "puppy" | "review"; id: string; title: string } | null>(null);

  const puppies = React.useMemo(() => {
    const all = puppiesQ.data ?? [];
    const q = puppySearch.trim().toLowerCase();
    if (!q) return all;
    return all.filter((p) => `${p.name} ${p.breed} ${p.sex} ${p.age} ${p.temperament}`.toLowerCase().includes(q));
  }, [puppiesQ.data, puppySearch]);

  const reviews = React.useMemo(() => {
    const all = reviewsQ.data ?? [];
    const q = reviewSearch.trim().toLowerCase();
    if (!q) return all;
    return all.filter((r) => `${r.reviewerName} ${r.testimonialText}`.toLowerCase().includes(q));
  }, [reviewsQ.data, reviewSearch]);

  function openCreatePuppy() {
    setSelectedPuppy(null);
    setPuppyDialogMode("create");
    setPuppyDialogOpen(true);
  }

  function openEditPuppy(p: Puppy) {
    setSelectedPuppy(p);
    setPuppyDialogMode("edit");
    setPuppyDialogOpen(true);
  }

  function openCreateReview() {
    setSelectedReview(null);
    setReviewDialogMode("create");
    setReviewDialogOpen(true);
  }

  function openEditReview(r: Review) {
    setSelectedReview(r);
    setReviewDialogMode("edit");
    setReviewDialogOpen(true);
  }

  function askDelete(kind: "puppy" | "review", id: string, title: string) {
    setConfirmCtx({ kind, id, title });
    setConfirmOpen(true);
  }

  async function confirmDelete() {
    if (!confirmCtx) return;
    try {
      if (confirmCtx.kind === "puppy") {
        await deletePuppy.mutateAsync(confirmCtx.id);
        toast({ title: "Listing deleted", description: "The puppy listing has been removed." });
      } else {
        await deleteReview.mutateAsync(confirmCtx.id);
        toast({ title: "Review deleted", description: "The review has been removed." });
      }
      setConfirmOpen(false);
    } catch (err: any) {
      toast({ title: "Delete failed", description: err?.message ?? "Please try again.", variant: "destructive" });
    }
  }

  return (
    <SiteShell>
      <Seo title="Dashboard — American Eskimo" description="Manage puppy listings, review inquiries, and curate testimonials." />

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="Dashboard"
            title="Listings & Inquiries"
            description="A calm control room for your breeder website—curate, respond, and keep details accurate."
            data-testid="dashboard-heading"
          />
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 rounded-xl border border-border/70 bg-card/70 px-3 py-2 text-sm shadow-sm">
              <Shield className="h-4 w-4 text-accent" />
              <span className="text-muted-foreground">Auth:</span>
              <span className="font-semibold text-foreground" data-testid="dashboard-auth-state">
                {meQ.isLoading ? "Checking…" : user ? `Signed in as ${user.name}` : "Not signed in"}
              </span>
              {user?.role ? (
                <Badge className="ml-1 border-border/60 bg-secondary text-foreground hover:bg-secondary" data-testid="dashboard-role">
                  {user.role}
                </Badge>
              ) : null}
            </div>

            <Button
              type="button"
              variant="outline"
              className="rounded-xl border-border/70 bg-card/70 hover:bg-secondary"
              onClick={() => window.location.reload()}
              data-testid="dashboard-reload"
            >
              Reload
            </Button>
          </div>
        </div>

        {!meQ.isLoading && !user ? (
          <SignInRequired />
        ) : (
          <div className="surface-card grain-overlay rounded-[2rem] border border-border/70 p-4 sm:p-6">
            <Tabs value={tab} onValueChange={(v) => setTab(v as any)} className="w-full">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <TabsList className="rounded-2xl bg-secondary/40 p-1" data-testid="dashboard-tabs">
                  <TabsTrigger value="puppies" className="rounded-xl data-[state=active]:bg-card data-[state=active]:shadow-sm" data-testid="dashboard-tab-puppies">
                    <PawPrint className="mr-2 h-4 w-4" />
                    Puppies
                  </TabsTrigger>
                  <TabsTrigger value="inquiries" className="rounded-xl data-[state=active]:bg-card data-[state=active]:shadow-sm" data-testid="dashboard-tab-inquiries">
                    <Inbox className="mr-2 h-4 w-4" />
                    Inquiries
                  </TabsTrigger>
                  <TabsTrigger value="reviews" className="rounded-xl data-[state=active]:bg-card data-[state=active]:shadow-sm" data-testid="dashboard-tab-reviews">
                    <Star className="mr-2 h-4 w-4" />
                    Reviews
                  </TabsTrigger>
                  <TabsTrigger value="settings" className="rounded-xl data-[state=active]:bg-card data-[state=active]:shadow-sm" data-testid="dashboard-tab-settings">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </TabsTrigger>
                </TabsList>

                <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                  {tab === "puppies" ? (
                    <>
                      <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          value={puppySearch}
                          onChange={(e) => setPuppySearch(e.target.value)}
                          className="pl-9 rounded-xl bg-card/70 border-border/70 focus-ring sm:w-[280px]"
                          placeholder="Search puppies…"
                          data-testid="dashboard-puppy-search"
                        />
                      </div>
                      <Button
                        type="button"
                        onClick={openCreatePuppy}
                        disabled={!isAdmin}
                        className={cn(
                          "rounded-xl transition-all btn-sheen",
                          isAdmin
                            ? "bg-gradient-to-r from-primary to-primary/85 text-primary-foreground shadow-md shadow-primary/20 hover:-translate-y-0.5 hover:shadow-lg"
                            : "opacity-50 cursor-not-allowed"
                        )}
                        data-testid="dashboard-add-puppy"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        New listing
                      </Button>
                    </>
                  ) : tab === "reviews" ? (
                    <>
                      <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          value={reviewSearch}
                          onChange={(e) => setReviewSearch(e.target.value)}
                          className="pl-9 rounded-xl bg-card/70 border-border/70 focus-ring sm:w-[280px]"
                          placeholder="Search reviews…"
                          data-testid="dashboard-review-search"
                        />
                      </div>
                      <Button
                        type="button"
                        onClick={openCreateReview}
                        disabled={!isAdmin}
                        className={cn(
                          "rounded-xl transition-all btn-sheen",
                          isAdmin
                            ? "bg-gradient-to-r from-primary to-primary/85 text-primary-foreground shadow-md shadow-primary/20 hover:-translate-y-0.5 hover:shadow-lg"
                            : "opacity-50 cursor-not-allowed"
                        )}
                        data-testid="dashboard-add-review"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        New review
                      </Button>
                    </>
                  ) : tab === "settings" ? (
                    <div className="text-sm text-muted-foreground">
                      Manage global site configuration.
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">
                      Inquiries are read-only in this MVP UI.
                    </div>
                  )}
                </div>
              </div>

              <Separator className="my-5" />

              <TabsContent value="puppies" className="mt-0">
                {puppiesQ.isLoading ? (
                  <div className="grid gap-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="h-14 rounded-2xl skeleton-shimmer" />
                    ))}
                  </div>
                ) : puppiesQ.isError ? (
                  <div className="rounded-3xl border border-border/70 bg-card p-6 shadow-sm" data-testid="dashboard-puppies-error">
                    <div className="text-sm font-semibold">Couldn’t load puppies</div>
                    <div className="mt-1 text-sm text-muted-foreground">{(puppiesQ.error as Error)?.message}</div>
                  </div>
                ) : (
                  <div className="overflow-hidden rounded-3xl border border-border/70 bg-card/60">
                    <Table data-testid="dashboard-puppies-table">
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Breed</TableHead>
                          <TableHead className="hidden md:table-cell">Age</TableHead>
                          <TableHead className="hidden md:table-cell">Temperament</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {puppies.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
                              No listings found.
                            </TableCell>
                          </TableRow>
                        ) : (
                          puppies.map((p) => (
                            <TableRow key={p.id} data-testid={`dashboard-puppy-row-${p.id}`}>
                              <TableCell className="font-semibold">{p.name}</TableCell>
                              <TableCell className="text-muted-foreground">{p.breed}</TableCell>
                              <TableCell className="hidden md:table-cell text-muted-foreground">{p.age}</TableCell>
                              <TableCell className="hidden md:table-cell text-muted-foreground">
                                <span className="line-clamp-1">{p.temperament}</span>
                              </TableCell>
                              <TableCell>
                                {p.isAvailable ? (
                                  <Badge className="border-border/60 bg-accent/12 text-accent hover:bg-accent/12">Available</Badge>
                                ) : (
                                  <Badge variant="secondary" className="border-border/60 bg-muted text-muted-foreground hover:bg-muted">
                                    Reserved
                                  </Badge>
                                )}
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="inline-flex items-center gap-2">
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    className="rounded-xl border-border/70 bg-card/70 hover:bg-secondary"
                                    onClick={() => openEditPuppy(p)}
                                    disabled={!isAdmin}
                                    data-testid={`dashboard-puppy-edit-${p.id}`}
                                  >
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    className="rounded-xl border-border/70 bg-card/70 hover:bg-secondary"
                                    onClick={() => askDelete("puppy", p.id, p.name)}
                                    disabled={!isAdmin}
                                    data-testid={`dashboard-puppy-delete-${p.id}`}
                                  >
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="inquiries" className="mt-0">
                {inquiriesQ.isLoading ? (
                  <div className="grid gap-3">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div key={i} className="h-14 rounded-2xl skeleton-shimmer" />
                    ))}
                  </div>
                ) : inquiriesQ.isError ? (
                  <div className="rounded-3xl border border-border/70 bg-card p-6 shadow-sm" data-testid="dashboard-inquiries-error">
                    <div className="text-sm font-semibold">Couldn’t load inquiries</div>
                    <div className="mt-1 text-sm text-muted-foreground">{(inquiriesQ.error as Error)?.message}</div>
                  </div>
                ) : (
                  <div className="overflow-hidden rounded-3xl border border-border/70 bg-card/60">
                    <Table data-testid="dashboard-inquiries-table">
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead className="hidden md:table-cell">Email</TableHead>
                          <TableHead className="hidden md:table-cell">Phone</TableHead>
                          <TableHead className="hidden lg:table-cell">Selected puppy</TableHead>
                          <TableHead>Message</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {(inquiriesQ.data ?? []).length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} className="py-10 text-center text-sm text-muted-foreground">
                              No inquiries yet.
                            </TableCell>
                          </TableRow>
                        ) : (
                          (inquiriesQ.data ?? []).map((inq) => (
                            <TableRow key={inq.id} data-testid={`dashboard-inquiry-row-${inq.id}`}>
                              <TableCell className="font-semibold">{inq.fullName}</TableCell>
                              <TableCell className="hidden md:table-cell text-muted-foreground">{inq.email}</TableCell>
                              <TableCell className="hidden md:table-cell text-muted-foreground">{inq.phone}</TableCell>
                              <TableCell className="hidden lg:table-cell text-muted-foreground">
                                {inq.selectedPuppyId ? (
                                  <span className="rounded-lg border border-border/60 bg-secondary/40 px-2 py-1 text-xs font-semibold">
                                    {inq.selectedPuppyId}
                                  </span>
                                ) : (
                                  <span className="text-xs text-muted-foreground">—</span>
                                )}
                              </TableCell>
                              <TableCell className="text-muted-foreground">
                                <span className="line-clamp-2">{inq.message}</span>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="reviews" className="mt-0">
                {reviewsQ.isLoading ? (
                  <div className="grid gap-3">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div key={i} className="h-14 rounded-2xl skeleton-shimmer" />
                    ))}
                  </div>
                ) : reviewsQ.isError ? (
                  <div className="rounded-3xl border border-border/70 bg-card p-6 shadow-sm" data-testid="dashboard-reviews-error">
                    <div className="text-sm font-semibold">Couldn’t load reviews</div>
                    <div className="mt-1 text-sm text-muted-foreground">{(reviewsQ.error as Error)?.message}</div>
                  </div>
                ) : (
                  <div className="overflow-hidden rounded-3xl border border-border/70 bg-card/60">
                    <Table data-testid="dashboard-reviews-table">
                      <TableHeader>
                        <TableRow>
                          <TableHead>Reviewer</TableHead>
                          <TableHead className="hidden md:table-cell">Rating</TableHead>
                          <TableHead>Featured</TableHead>
                          <TableHead>Text</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {reviews.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} className="py-10 text-center text-sm text-muted-foreground">
                              No reviews found.
                            </TableCell>
                          </TableRow>
                        ) : (
                          reviews.map((r) => (
                            <TableRow key={r.id} data-testid={`dashboard-review-row-${r.id}`}>
                              <TableCell className="font-semibold">{r.reviewerName}</TableCell>
                              <TableCell className="hidden md:table-cell text-muted-foreground">{r.rating}/5</TableCell>
                              <TableCell>
                                {r.isFeatured ? (
                                  <Badge className="border-border/60 bg-[hsl(var(--chart-3))]/15 text-foreground hover:bg-[hsl(var(--chart-3))]/15">
                                    Featured
                                  </Badge>
                                ) : (
                                  <Badge variant="secondary" className="border-border/60 bg-muted text-muted-foreground hover:bg-muted">
                                    —
                                  </Badge>
                                )}
                              </TableCell>
                              <TableCell className="text-muted-foreground">
                                <span className="line-clamp-2">{r.testimonialText}</span>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="inline-flex items-center gap-2">
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    className="rounded-xl border-border/70 bg-card/70 hover:bg-secondary"
                                    onClick={() => openEditReview(r)}
                                    disabled={!isAdmin}
                                    data-testid={`dashboard-review-edit-${r.id}`}
                                  >
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    className="rounded-xl border-border/70 bg-card/70 hover:bg-secondary"
                                    onClick={() => askDelete("review", r.id, r.reviewerName)}
                                    disabled={!isAdmin}
                                    data-testid={`dashboard-review-delete-${r.id}`}
                                  >
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="settings" className="mt-0">
                <div className="surface-card grain-overlay rounded-3xl border border-border/70 bg-card/60 p-6 shadow-sm max-w-lg">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="rounded-xl bg-primary/10 p-2">
                      <Settings className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Site Configuration</h3>
                      <p className="text-sm text-muted-foreground">Update global contact details and app settings.</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-foreground/80">Support Contact Phone</label>
                      <div className="flex gap-2">
                        <Input 
                          value={contactPhone} 
                          onChange={(e) => setContactPhone(e.target.value)}
                          placeholder="e.g. +1 (555) 000-0000"
                          className="rounded-xl border-border/70 bg-card/70 focus-ring"
                          data-testid="input-contact-phone"
                        />
                        <Button 
                          onClick={handleUpdatePhone} 
                          disabled={updateSetting.isPending || !isAdmin}
                          className="rounded-xl bg-gradient-to-r from-primary to-primary/85 text-primary-foreground shadow-md shadow-primary/20 hover:shadow-lg transition-all btn-sheen"
                          data-testid="button-save-phone"
                        >
                          {updateSetting.isPending ? "Saving..." : "Save"}
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        This phone number will be displayed in the footer and contact page.
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>

      <PuppyFormDialog
        open={puppyDialogOpen}
        onOpenChange={setPuppyDialogOpen}
        mode={puppyDialogMode}
        puppy={selectedPuppy}
      />

      <ReviewFormDialog
        open={reviewDialogOpen}
        onOpenChange={setReviewDialogOpen}
        mode={reviewDialogMode}
        review={selectedReview}
      />

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={`Delete ${confirmCtx?.kind === "puppy" ? "listing" : "review"}?`}
        description={`Are you sure you want to delete "${confirmCtx?.title}"? This action cannot be undone.`}
        onConfirm={confirmDelete}
        confirmText="Delete"
        variant="destructive"
      />
    </SiteShell>
  );
}
