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
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Star, Flag } from "lucide-react";
import axios from "axios";
import type { User } from "@/lib/auth-types";
import type { Review } from "@/app/types";
import { useToast } from "@/hooks/use-toast";

export default function ReviewsPage() {
  const { toast } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getVendorId = () => {
    const user = localStorage.getItem("user") as string | null;
    if (!user) return undefined;
    return (JSON.parse(user) as User)?._id;
  };

  const fetchReviews = () => {
    const vendorId = getVendorId();
    if (!vendorId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/reviews/vendor/${vendorId}`)
      .then((response) => setReviews(response.data))
      .catch(() => {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load reviews",
        });
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const openReportDialog = (review: Review) => {
    setSelectedReview(review);
    setReportReason("");
    setIsReportDialogOpen(true);
  };

  const handleSubmitReport = () => {
    if (!selectedReview || !reportReason.trim()) return;

    const vendorId = getVendorId();
    setIsSubmitting(true);

    axios
      .post(
        `${process.env.NEXT_PUBLIC_API_URL}/reviews/${selectedReview._id}/report`,
        { vendorId, reason: reportReason.trim() },
      )
      .then(() => {
        toast({
          variant: "default",
          title: "Review reported",
          description: "Our admin team will look into this review.",
        });
        setReviews((prev) =>
          prev.map((r) =>
            r._id === selectedReview._id
              ? { ...r, reportStatus: "pending" as const }
              : r,
          ),
        );
        setIsReportDialogOpen(false);
      })
      .catch((error) => {
        toast({
          variant: "destructive",
          title: "Error",
          description:
            error.response?.data?.message || "Failed to report review",
        });
      })
      .finally(() => setIsSubmitting(false));
  };

  const reportStatusBadge = (status?: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="warning">Reported</Badge>;
      case "resolved":
        return <Badge variant="success">Resolved</Badge>;
      case "dismissed":
        return <Badge variant="secondary">Dismissed</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Reviews</h2>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Comment</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">
                  Loading reviews...
                </TableCell>
              </TableRow>
            ) : reviews.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">
                  <p className="text-stone-500 font-medium">No reviews yet</p>
                  <p className="text-stone-400 text-xs mt-1">
                    Reviews left on your products will appear here
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
                  <TableCell className="max-w-xs">
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {review.comment || "—"}
                    </p>
                  </TableCell>
                  <TableCell>
                    {new Date(review.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {review.reportStatus && review.reportStatus !== "none" ? (
                      reportStatusBadge(review.reportStatus)
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openReportDialog(review)}
                      >
                        <Flag className="h-3.5 w-3.5 mr-1.5" />
                        Report
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Report review dialog */}
      <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Report this review</DialogTitle>
            <DialogDescription>
              Explain why this review should be reviewed by an admin. This
              won't remove the review immediately — our team will look into
              it.
            </DialogDescription>
          </DialogHeader>

          <Textarea
            placeholder="Explain why you're reporting this review..."
            value={reportReason}
            onChange={(e) => setReportReason(e.target.value)}
            maxLength={1000}
            rows={5}
          />
          <p className="text-xs text-gray-400 text-right">
            {reportReason.length}/1000
          </p>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsReportDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitReport}
              disabled={!reportReason.trim() || isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Report"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
