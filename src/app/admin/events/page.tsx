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
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Search, Calendar, Gift, MapPin, Clock, User } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import axios from "axios";
import { Event, Gift as IGift } from "@/app/types";
import { formatDate, formatTime } from "@/app/common";

// Dummy data - replace with API call
const eventTypes = ["Recurring", "One Time"];
const eventStatuses = ["Upcoming", "Ongoing", "Completed", "Cancelled"];

export default function EventsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [itemsPerPage, setItemsPerPage] = useState("20");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);

  // Filter events based on search term, type and status
  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType =
      selectedType === "all" ||
      (selectedType === "Recurring" && event.recurringEvent === true) ||
      (selectedType === "One Time" && event.recurringEvent === false);

    return matchesSearch && matchesType;
  });

  // Pagination
  const totalPages = Math.ceil(filteredEvents.length / Number(itemsPerPage));
  const paginatedEvents = filteredEvents.slice(
    (currentPage - 1) * Number(itemsPerPage),
    currentPage * Number(itemsPerPage)
  );

  // Display event details
  const handleEventDetails = (event: any) => {
    setSelectedEvent(event);
    setIsDialogOpen(true);
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Upcoming":
        return "bg-blue-100 text-blue-800";
      case "Ongoing":
        return "bg-green-100 text-green-800";
      case "Completed":
        return "bg-gray-100 text-gray-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const fetchEvents = async (): Promise<Event[]> => {
    return new Promise(async (resolve, reject) => {
      try {
        await axios
          .get(`${process.env.NEXT_PUBLIC_API_URL}/events`)
          .then((res) => {
            resolve(res.data);
          })
          .catch((err) => {
            reject(err);
          });
      } catch (error) {
        reject(error);
      }
    });
  };

  useEffect(() => {
    fetchEvents()
      .then((res) => {
        setEvents(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Events Management</h2>
      </div>

      {/* Filters and search */}
      <div className="flex flex-col sm:flex-row gap-4 items-end">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search events..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {eventTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={itemsPerPage} onValueChange={setItemsPerPage}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Items per page" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="20">20 per page</SelectItem>
            <SelectItem value="50">50 per page</SelectItem>
            <SelectItem value="100">100 per page</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Events table */}
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Event Name</TableHead>

              <TableHead>Date</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Organizer</TableHead>
              <TableHead>Products</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedEvents.map((event) => (
              <TableRow key={event._id}>
                <TableCell>{event._id}</TableCell>
                <TableCell className="font-medium">{event.title}</TableCell>

                <TableCell>
                  {formatDate(event.fullDate)} {formatTime(event.time)}
                </TableCell>
                <TableCell>{event.location}</TableCell>
                <TableCell>{event.user?.name}</TableCell>
                <TableCell>{event.gifts?.length} items</TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEventDetails(event)}
                  >
                    Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination controls */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Showing {(currentPage - 1) * Number(itemsPerPage) + 1} to{" "}
          {Math.min(currentPage * Number(itemsPerPage), filteredEvents.length)}{" "}
          of {filteredEvents.length} events
        </div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className={
                  currentPage === 1 ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNumber = i + 1;
              return (
                <PaginationItem key={pageNumber}>
                  <PaginationLink
                    isActive={pageNumber === currentPage}
                    onClick={() => setCurrentPage(pageNumber)}
                  >
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              );
            })}

            {totalPages > 5 && <PaginationEllipsis />}

            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                className={
                  currentPage === totalPages
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      {/* Event details dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Event Details</DialogTitle>
          </DialogHeader>

          {selectedEvent && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold">
                      {selectedEvent.title}
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-start gap-2">
                      <Calendar className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium">Date & Time</p>
                        <p className="text-sm text-gray-500">
                          {formatDate(selectedEvent.fullDate)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <MapPin className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium">Location</p>
                        <p className="text-sm text-gray-500">
                          {selectedEvent.location}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <User className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium">Organizer</p>
                        <p className="text-sm text-gray-500">
                          {selectedEvent.user?.name}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <Clock className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium">Created</p>
                        <p className="text-sm text-gray-500">
                          {new Date(
                            selectedEvent.createdAt
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex-1">
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-3 flex items-center">
                      <Gift className="h-4 w-4 mr-2 text-gray-400" />
                      Event Products ({selectedEvent.gifts?.length || 0})
                    </h4>
                    <div className="space-y-3">
                      {selectedEvent.gifts?.map((gift: IGift) => (
                        <div
                          key={gift._id}
                          className="border-b pb-2 last:border-0 last:pb-0"
                        >
                          <p className="font-medium">{gift.product?.title}</p>
                          <div className="flex justify-between text-sm text-gray-500">
                            <span>{gift.product?.vendor.name}</span>
                            <span>${gift.product?.price}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Recurring Event</p>
                  <p className="text-sm text-gray-500">
                    {selectedEvent.recurringEvent ? "Yes" : "No"}
                  </p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
