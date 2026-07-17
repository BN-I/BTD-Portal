"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Star, Trash2, X, Eye } from "lucide-react";
import axios from "axios";
import type { Review } from "@/app/types";
import { useToast } from "@/hooks/use-toast";

export default function ReportedReviewsPage() {
  const { toast } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<Review | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const vendorName = (vendor: Review["vendor"]) =>
    typeof vendor === "string" ? vendor : vendor?.name;

  const fetchReportedReviews = () => {
    setLoading(true);
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/admin/reviews/reported`)
      .then((response) => setReviews(response.data))
      .catch(() => {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load reported reviews",
        });
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchReportedReviews();
  }, []);

  const openDetails = (review: Review) => {
    setSelectedReview(review);
    setIsDetailsDialogOpen(true);
  };

  const handleDismiss = (reviewId: string) => {
    axios
      .put(`${process.env.NEXT_PUBLIC_API_URL}/admin/reviews/${reviewId}/dismiss`)
      .then(() => {
        setReviews((prev) => prev.filter((r) => r._id !== reviewId));
        setIsDetailsDialogOpen(false);
        toast({
          variant: "default",
          title: "Report dismissed",
          description: "The review will stay up.",
        });
      })
      .catch((error) => {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message,
        });
      });
  };

  // Stacking the delete AlertDialog on top of the still-open details Dialog
  // confuses Radix's body pointer-events lock (both closing at once leaves
  // the page unclickable), so the details dialog is closed first and the
  // AlertDialog only opens once its close animation (duration-200) finishes.
  const DIALOG_TRANSITION_MS = 200;

  const confirmDelete = (review: Review) => {
    setReviewToDelete(review);
    setIsDetailsDialogOpen(false);
    setTimeout(() => {
      setIsDeleteDialogOpen(true);
    }, DIALOG_TRANSITION_MS);
  };

  const closeDeleteDialog = (reopenDetails: boolean) => {
    setIsDeleteDialogOpen(false);
    if (reopenDetails) {
      setTimeout(() => {
        setIsDetailsDialogOpen(true);
      }, DIALOG_TRANSITION_MS);
    } else {
      setReviewToDelete(null);
    }
  };

  const handleDeleteReview = () => {
    if (!reviewToDelete) return;

    axios
      .delete(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/reviews/${reviewToDelete._id}`,
      )
      .then(() => {
        setReviews((prev) =>
          prev.filter((r) => r._id !== reviewToDelete._id),
        );
        toast({
          variant: "default",
          title: "Review deleted",
          description:
            "The review has been removed and no longer affects the product's rating.",
        });
      })
      .catch((error) => {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message,
        });
      })
      .finally(() => {
        closeDeleteDialog(false);
      });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Reported Reviews</h2>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Comment</TableHead>
              <TableHead>Reported By</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">
                  Loading reported reviews...
                </TableCell>
              </TableRow>
            ) : reviews.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">
                  <p className="text-stone-500 font-medium">
                    No reported reviews
                  </p>
                  <p className="text-stone-400 text-xs mt-1">
                    Reviews vendors report will show up here for you to
                    review
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              reviews.map((review) => (
                <TableRow key={review._id}>
                  <TableCell className="flex items-center gap-3">
                    {review.product?.images?.[0] && (
                      <img
                        src={review.product.images[0]}
                        alt={review.product.title}
                        className="h-10 w-10 rounded-md object-cover"
                      />
                    )}
                    <span className="font-medium">
                      {review.product?.title}
                    </span>
                  </TableCell>
                  <TableCell>{review.user?.name}</TableCell>
                  <TableCell>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-3.5 w-3.5 ${
                            star <= review.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[200px]">
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {review.comment || "—"}
                    </p>
                  </TableCell>
                  <TableCell>{vendorName(review.vendor)}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openDetails(review)}
                    >
                      <Eye className="h-3.5 w-3.5 mr-1.5" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Review details dialog */}
      <Dialog
        open={isDetailsDialogOpen}
        onOpenChange={setIsDetailsDialogOpen}
      >
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Reported Review</DialogTitle>
            <DialogDescription>
              Review the report and decide whether to dismiss it or remove
              the review.
            </DialogDescription>
          </DialogHeader>

          {selectedReview && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                {selectedReview.product?.images?.[0] && (
                  <img
                    src={selectedReview.product.images[0]}
                    alt={selectedReview.product.title}
                    className="h-12 w-12 rounded-md object-cover"
                  />
                )}
                <div>
                  <Label>Product</Label>
                  <div className="font-medium">
                    {selectedReview.product?.title}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Customer</Label>
                  <div>{selectedReview.user?.name}</div>
                </div>
                <div>
                  <Label>Rating</Label>
                  <div className="flex mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= selectedReview.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <Label>Comment</Label>
                <p className="text-sm text-gray-600 mt-1">
                  {selectedReview.comment || "—"}
                </p>
              </div>

              <div className="border-t pt-4">
                <div>
                  <Label>Reported By</Label>
                  <div>{vendorName(selectedReview.vendor)}</div>
                </div>
                <div className="mt-3">
                  <Label>Reason</Label>
                  <p className="text-sm text-gray-600 mt-1 whitespace-pre-wrap">
                    {selectedReview.reportReason}
                  </p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => selectedReview && handleDismiss(selectedReview._id)}
            >
              <X className="h-3.5 w-3.5 mr-1.5" />
              Dismiss
            </Button>
            <Button
              variant="destructive"
              onClick={() => selectedReview && confirmDelete(selectedReview)}
            >
              <Trash2 className="h-3.5 w-3.5 mr-1.5" />
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete review confirmation dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={(open) => {
          if (open) {
            setIsDeleteDialogOpen(true);
          } else {
            closeDeleteDialog(true);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this review?</AlertDialogTitle>
            <AlertDialogDescription>
              This hides the review from customers and vendors and
              recalculates the product's rating as if it were never left. It
              stays in the database for audit purposes.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => closeDeleteDialog(true)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteReview}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
