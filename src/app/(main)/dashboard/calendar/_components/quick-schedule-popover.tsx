"use client";

import { useState } from "react";

import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock, Users, Video } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface QuickSchedulePopoverProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Helper function to round time to next hour
function getNextHourTime() {
  const now = new Date();
  now.setHours(now.getHours() + 1, 0, 0, 0);
  return format(now, "HH:mm");
}

// Helper function to add 1 hour to a time string
function addOneHour(timeString: string) {
  const [hours, minutes] = timeString.split(":").map(Number);
  const newHours = (hours + 1) % 24;
  return `${String(newHours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

export function QuickSchedulePopover({ open, onOpenChange }: QuickSchedulePopoverProps) {
  const [date, setDate] = useState<Date>(new Date());
  const [startTime, setStartTime] = useState(getNextHourTime());
  const [endTime, setEndTime] = useState(addOneHour(getNextHourTime()));
  const [showParticipants, setShowParticipants] = useState(false);
  const [participants, setParticipants] = useState("");
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [videoLink, setVideoLink] = useState("");

  const handleSubmit = () => {
    // Validate that end time is after start time
    if (startTime >= endTime) {
      alert("End time must be after start time");
      return;
    }

    // Create event object
    const event = {
      date: format(date, "yyyy-MM-dd"),
      startTime,
      endTime,
      participants: participants ? participants.split(",").map((p) => p.trim()) : [],
      videoLink: videoLink || undefined,
    };

    console.log("Quick Meeting Scheduled:", event);

    // Reset form
    setDate(new Date());
    setStartTime(getNextHourTime());
    setEndTime(addOneHour(getNextHourTime()));
    setShowParticipants(false);
    setParticipants("");
    setShowVideoCall(false);
    setVideoLink("");

    // Close popover
    onOpenChange(false);
  };

  const handleCancel = () => {
    // Reset form
    setDate(new Date());
    setStartTime(getNextHourTime());
    setEndTime(addOneHour(getNextHourTime()));
    setShowParticipants(false);
    setParticipants("");
    setShowVideoCall(false);
    setVideoLink("");

    // Close popover
    onOpenChange(false);
  };

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <CalendarIcon className="size-4" />
          Schedule
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96" align="end">
        <div className="space-y-4">
          {/* Header */}
          <div>
            <h3 className="font-semibold">Schedule Meeting</h3>
            <p className="text-muted-foreground text-sm">Quick schedule a meeting or event</p>
          </div>

          {/* Date Picker */}
          <div className="space-y-2">
            <Label>Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 size-4" />
                  {date ? format(date, "MMMM do, yyyy") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={date} onSelect={(d) => d && setDate(d)} initialFocus />
              </PopoverContent>
            </Popover>
          </div>

          {/* Time Inputs */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="start-time">Start</Label>
              <div className="relative">
                <Clock className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                <Input
                  id="start-time"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-time">End</Label>
              <div className="relative">
                <Clock className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                <Input
                  id="end-time"
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </div>

          {/* Add Participants */}
          {!showParticipants ? (
            <Button variant="outline" size="sm" onClick={() => setShowParticipants(true)} className="w-full">
              <Users className="mr-2 size-4" />
              Add participants
            </Button>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="participants">Participants</Label>
              <Input
                id="participants"
                placeholder="Enter emails, teams, or accounts (comma-separated)"
                value={participants}
                onChange={(e) => setParticipants(e.target.value)}
              />
            </div>
          )}

          {/* Add Video Call */}
          {!showVideoCall ? (
            <Button variant="outline" size="sm" onClick={() => setShowVideoCall(true)} className="w-full">
              <Video className="mr-2 size-4" />
              Add video call
            </Button>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="video-link">Video Call Link</Label>
              <Input
                id="video-link"
                placeholder="Paste Google Meet, Zoom, or Teams link"
                value={videoLink}
                onChange={(e) => setVideoLink(e.target.value)}
              />
            </div>
          )}

          {/* Footer Buttons */}
          <div className="flex gap-2">
            <Button variant="ghost" onClick={handleCancel} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSubmit} className="flex-1">
              Schedule
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
