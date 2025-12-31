"use client";

import { useState } from "react";

import { format } from "date-fns";
import { CalendarIcon, Clock, Coffee, Plane, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface CreateEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateEventDialog({ open, onOpenChange }: CreateEventDialogProps) {
  // Tab control
  const [activeTab, setActiveTab] = useState("quick");

  // Common fields
  const [title, setTitle] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isAllDay, setIsAllDay] = useState(false);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [location, setLocation] = useState("");

  // Meeting-specific
  const [participants, setParticipants] = useState("");
  const [meetingLink, setMeetingLink] = useState("");
  const [agenda, setAgenda] = useState("");
  const [sendNotifications, setSendNotifications] = useState(true);
  const [duration, setDuration] = useState("60");

  // Meal/Break-specific
  const [mealType, setMealType] = useState("lunch");

  // Out of Office-specific
  const [statusType, setStatusType] = useState("vacation");
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [autoReply, setAutoReply] = useState("");

  // Detailed/Advanced fields
  const [description, setDescription] = useState("");
  const [notes, setNotes] = useState("");
  const [reminder, setReminder] = useState<string | undefined>(undefined);
  const [timezone, setTimezone] = useState("GMT+7");
  const [organizerName, setOrganizerName] = useState("You");
  const [organizerEmail, setOrganizerEmail] = useState("you@example.com");
  const [organizerPhone, setOrganizerPhone] = useState("");

  // Handle duration preset for meetings
  const handleDurationPreset = (minutes: string) => {
    setDuration(minutes);
    if (startTime) {
      const [hours, mins] = startTime.split(":").map(Number);
      const totalMinutes = hours * 60 + mins + parseInt(minutes);
      const newHours = Math.floor(totalMinutes / 60) % 24;
      const newMins = totalMinutes % 60;
      setEndTime(`${String(newHours).padStart(2, "0")}:${String(newMins).padStart(2, "0")}`);
    }
  };

  // Auto-fill title based on meal type
  const handleMealTypeChange = (type: string) => {
    setMealType(type);
    const mealTitles: Record<string, string> = {
      breakfast: "Breakfast",
      coffee: "Coffee Break",
      lunch: "Lunch Break",
      dinner: "Dinner",
      snack: "Snack Break",
    };
    setTitle(mealTitles[type] || "");

    // Set default durations
    const durations: Record<string, number> = {
      breakfast: 30,
      coffee: 15,
      lunch: 60,
      dinner: 90,
      snack: 15,
    };
    const mins = durations[type] || 60;
    setDuration(String(mins));
  };

  // Auto-fill title based on status type
  const handleStatusTypeChange = (type: string) => {
    setStatusType(type);
    const statusTitles: Record<string, string> = {
      vacation: "Vacation",
      ooo: "Out of Office",
      sick: "Sick Leave",
      personal: "Personal Day",
      remote: "Working Remotely",
      trip: "Business Trip",
    };
    setTitle(statusTitles[type] || "");
    setIsAllDay(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const baseData = {
      title,
      date: date ? format(date, "yyyy-MM-dd") : "",
      startTime: isAllDay ? "00:00" : startTime,
      endTime: isAllDay ? "23:59" : endTime,
      location: location || undefined,
      organizer: {
        name: organizerName,
        email: organizerEmail,
        phone: organizerPhone || undefined,
      },
    };

    let eventData = {};

    switch (activeTab) {
      case "quick":
        eventData = {
          ...baseData,
          notes: notes || undefined,
          participants: [],
        };
        break;

      case "meeting":
        eventData = {
          ...baseData,
          participants: participants
            .split(",")
            .map((p) => p.trim())
            .filter(Boolean)
            .map((email) => ({ email, name: email.split("@")[0], status: "pending" })),
          meetingLink: meetingLink || undefined,
          notes: agenda || undefined,
          reminder: reminder ? parseInt(reminder) : undefined,
          timezone: timezone || undefined,
        };
        break;

      case "meal":
        eventData = {
          ...baseData,
          participants: participants
            .split(",")
            .map((p) => p.trim())
            .filter(Boolean)
            .map((email) => ({ email, name: email.split("@")[0], status: "pending" })),
          description: `${mealType} break`,
        };
        break;

      case "away":
        eventData = {
          ...baseData,
          date: date ? format(date, "yyyy-MM-dd") : "",
          // For multi-day, you'd need to handle date range differently
          description: autoReply || undefined,
          notes: `Out of office: ${statusType}`,
          participants: [],
        };
        break;

      case "detailed":
        eventData = {
          ...baseData,
          participants: participants
            .split(",")
            .map((p) => p.trim())
            .filter(Boolean)
            .map((email) => ({ email, name: email.split("@")[0], status: "pending" })),
          meetingLink: meetingLink || undefined,
          description: description || undefined,
          notes: notes || undefined,
          reminder: reminder ? parseInt(reminder) : undefined,
          timezone: timezone || undefined,
        };
        break;
    }

    // TODO: Implement event creation logic
    console.log("Event Data:", eventData);
    console.log("Active Tab:", activeTab);

    // Reset form and close
    resetForm();
    onOpenChange(false);
  };

  const resetForm = () => {
    setTitle("");
    setDate(new Date());
    setIsAllDay(false);
    setStartTime("09:00");
    setEndTime("10:00");
    setLocation("");
    setParticipants("");
    setMeetingLink("");
    setAgenda("");
    setSendNotifications(true);
    setDuration("60");
    setMealType("lunch");
    setStatusType("vacation");
    setEndDate(new Date());
    setAutoReply("");
    setDescription("");
    setNotes("");
    setReminder(undefined);
    setTimezone("GMT+7");
    setOrganizerName("You");
    setOrganizerEmail("you@example.com");
    setOrganizerPhone("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Event</DialogTitle>
          <DialogDescription>Choose an event type and fill in the details</DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="quick">Quick</TabsTrigger>
            <TabsTrigger value="meeting">
              <Users className="size-4" />
            </TabsTrigger>
            <TabsTrigger value="meal">
              <Coffee className="size-4" />
            </TabsTrigger>
            <TabsTrigger value="away">
              <Plane className="size-4" />
            </TabsTrigger>
            <TabsTrigger value="detailed">All</TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit}>
            <div className="max-h-[60vh] space-y-4 overflow-y-auto py-4">
              {/* Quick Event Tab */}
              <TabsContent
                value="quick"
                className="data-[state=active]:animate-in data-[state=active]:slide-in-from-right-4 data-[state=active]:fade-in-0 space-y-4 data-[state=active]:duration-300"
              >
                <div className="space-y-2">
                  <Label htmlFor="quick-title">Event Title</Label>
                  <Input
                    id="quick-title"
                    placeholder="Team Meeting"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                      >
                        <CalendarIcon className="mr-2 size-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={date} onSelect={setDate} />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="all-day" checked={isAllDay} onCheckedChange={setIsAllDay} />
                  <Label htmlFor="all-day">All-day event</Label>
                </div>

                {!isAllDay && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="quick-start-time">Start Time</Label>
                      <div className="relative">
                        <Clock className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                        <Input
                          id="quick-start-time"
                          type="time"
                          value={startTime}
                          onChange={(e) => setStartTime(e.target.value)}
                          className="pl-9"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="quick-end-time">End Time</Label>
                      <div className="relative">
                        <Clock className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                        <Input
                          id="quick-end-time"
                          type="time"
                          value={endTime}
                          onChange={(e) => setEndTime(e.target.value)}
                          className="pl-9"
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="quick-location">
                    Location <span className="text-muted-foreground">(optional)</span>
                  </Label>
                  <Input
                    id="quick-location"
                    placeholder="Conference Room A"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quick-notes">
                    Notes <span className="text-muted-foreground">(optional)</span>
                  </Label>
                  <Textarea
                    id="quick-notes"
                    placeholder="Add notes..."
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </TabsContent>

              {/* Meeting Tab */}
              <TabsContent
                value="meeting"
                className="data-[state=active]:animate-in data-[state=active]:slide-in-from-right-4 data-[state=active]:fade-in-0 space-y-4 data-[state=active]:duration-300"
              >
                <div className="space-y-2">
                  <Label htmlFor="meeting-title">Meeting Title</Label>
                  <Input
                    id="meeting-title"
                    placeholder="Team Standup"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                      >
                        <CalendarIcon className="mr-2 size-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={date} onSelect={setDate} />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="meeting-start-time">Start Time</Label>
                    <div className="relative">
                      <Clock className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                      <Input
                        id="meeting-start-time"
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className="pl-9"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="meeting-end-time">End Time</Label>
                    <div className="relative">
                      <Clock className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                      <Input
                        id="meeting-end-time"
                        type="time"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        className="pl-9"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Duration Presets</Label>
                  <div className="flex gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={() => handleDurationPreset("15")}>
                      15 min
                    </Button>
                    <Button type="button" variant="outline" size="sm" onClick={() => handleDurationPreset("30")}>
                      30 min
                    </Button>
                    <Button type="button" variant="outline" size="sm" onClick={() => handleDurationPreset("60")}>
                      1 hr
                    </Button>
                    <Button type="button" variant="outline" size="sm" onClick={() => handleDurationPreset("120")}>
                      2 hrs
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="meeting-participants">Participants</Label>
                  <Input
                    id="meeting-participants"
                    placeholder="email1@example.com, email2@example.com"
                    value={participants}
                    onChange={(e) => setParticipants(e.target.value)}
                  />
                  <p className="text-muted-foreground text-xs">Separate emails with commas</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="meeting-link">
                    Meeting Link <span className="text-muted-foreground">(optional)</span>
                  </Label>
                  <Input
                    id="meeting-link"
                    type="url"
                    placeholder="https://meet.google.com/..."
                    value={meetingLink}
                    onChange={(e) => setMeetingLink(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="meeting-location">
                    Location <span className="text-muted-foreground">(optional)</span>
                  </Label>
                  <Input
                    id="meeting-location"
                    placeholder="Conference Room A"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="meeting-agenda">
                    Agenda/Notes <span className="text-muted-foreground">(optional)</span>
                  </Label>
                  <Textarea
                    id="meeting-agenda"
                    placeholder="Meeting agenda and notes..."
                    rows={3}
                    value={agenda}
                    onChange={(e) => setAgenda(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="meeting-reminder">Reminder</Label>
                  <Select value={reminder} onValueChange={setReminder}>
                    <SelectTrigger id="meeting-reminder">
                      <SelectValue placeholder="None" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="5">5 minutes before</SelectItem>
                      <SelectItem value="15">15 minutes before</SelectItem>
                      <SelectItem value="30">30 minutes before</SelectItem>
                      <SelectItem value="60">1 hour before</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="notifications"
                    checked={sendNotifications}
                    onCheckedChange={(checked) => setSendNotifications(checked === true)}
                  />
                  <Label htmlFor="notifications">Send email notifications to participants</Label>
                </div>
              </TabsContent>

              {/* Meal/Break Tab */}
              <TabsContent
                value="meal"
                className="data-[state=active]:animate-in data-[state=active]:slide-in-from-right-4 data-[state=active]:fade-in-0 space-y-4 data-[state=active]:duration-300"
              >
                <div className="space-y-2">
                  <Label htmlFor="meal-type">Event Type</Label>
                  <Select value={mealType} onValueChange={handleMealTypeChange}>
                    <SelectTrigger id="meal-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="breakfast">Breakfast</SelectItem>
                      <SelectItem value="coffee">Coffee Break</SelectItem>
                      <SelectItem value="lunch">Lunch Break</SelectItem>
                      <SelectItem value="dinner">Dinner</SelectItem>
                      <SelectItem value="snack">Snack Break</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="meal-title">Title</Label>
                  <Input id="meal-title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>

                <div className="space-y-2">
                  <Label>Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                      >
                        <CalendarIcon className="mr-2 size-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={date} onSelect={setDate} />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="meal-start-time">Start Time</Label>
                    <div className="relative">
                      <Clock className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                      <Input
                        id="meal-start-time"
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className="pl-9"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="meal-duration">Duration</Label>
                    <Select value={duration} onValueChange={setDuration}>
                      <SelectTrigger id="meal-duration">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="90">1.5 hours</SelectItem>
                        <SelectItem value="120">2 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="meal-location">
                    Location <span className="text-muted-foreground">(optional)</span>
                  </Label>
                  <Input
                    id="meal-location"
                    placeholder="Kitchen, Cafe..."
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="meal-participants">
                    Invite others? <span className="text-muted-foreground">(optional)</span>
                  </Label>
                  <Input
                    id="meal-participants"
                    placeholder="email1@example.com, email2@example.com"
                    value={participants}
                    onChange={(e) => setParticipants(e.target.value)}
                  />
                </div>
              </TabsContent>

              {/* Out of Office/Away Tab */}
              <TabsContent
                value="away"
                className="data-[state=active]:animate-in data-[state=active]:slide-in-from-right-4 data-[state=active]:fade-in-0 space-y-4 data-[state=active]:duration-300"
              >
                <div className="space-y-2">
                  <Label htmlFor="status-type">Status Type</Label>
                  <Select value={statusType} onValueChange={handleStatusTypeChange}>
                    <SelectTrigger id="status-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vacation">Vacation</SelectItem>
                      <SelectItem value="ooo">Out of Office</SelectItem>
                      <SelectItem value="sick">Sick Leave</SelectItem>
                      <SelectItem value="personal">Personal Day</SelectItem>
                      <SelectItem value="remote">Working Remotely</SelectItem>
                      <SelectItem value="trip">Business Trip</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="away-title">Title</Label>
                  <Input id="away-title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                        >
                          <CalendarIcon className="mr-2 size-4" />
                          {date ? format(date, "PP") : <span>Pick date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={date} onSelect={setDate} />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label>End Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !endDate && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 size-4" />
                          {endDate ? format(endDate, "PP") : <span>Pick date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={endDate} onSelect={setEndDate} />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="away-all-day" checked={isAllDay} onCheckedChange={setIsAllDay} />
                  <Label htmlFor="away-all-day">All-day</Label>
                </div>

                {!isAllDay && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="away-start-time">Start Time</Label>
                      <div className="relative">
                        <Clock className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                        <Input
                          id="away-start-time"
                          type="time"
                          value={startTime}
                          onChange={(e) => setStartTime(e.target.value)}
                          className="pl-9"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="away-end-time">End Time</Label>
                      <div className="relative">
                        <Clock className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                        <Input
                          id="away-end-time"
                          type="time"
                          value={endTime}
                          onChange={(e) => setEndTime(e.target.value)}
                          className="pl-9"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="auto-reply">
                    Auto-reply Message <span className="text-muted-foreground">(optional)</span>
                  </Label>
                  <Textarea
                    id="auto-reply"
                    placeholder="I'm currently out of office..."
                    rows={3}
                    value={autoReply}
                    onChange={(e) => setAutoReply(e.target.value)}
                  />
                </div>
              </TabsContent>

              {/* Detailed Tab */}
              <TabsContent
                value="detailed"
                className="data-[state=active]:animate-in data-[state=active]:slide-in-from-right-4 data-[state=active]:fade-in-0 space-y-4 data-[state=active]:duration-300"
              >
                <div className="space-y-2">
                  <Label htmlFor="detailed-title">Event Title</Label>
                  <Input
                    id="detailed-title"
                    placeholder="Event title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                      >
                        <CalendarIcon className="mr-2 size-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={date} onSelect={setDate} />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="detailed-all-day" checked={isAllDay} onCheckedChange={setIsAllDay} />
                  <Label htmlFor="detailed-all-day">All-day event</Label>
                </div>

                {!isAllDay && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="detailed-start-time">Start Time</Label>
                      <div className="relative">
                        <Clock className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                        <Input
                          id="detailed-start-time"
                          type="time"
                          value={startTime}
                          onChange={(e) => setStartTime(e.target.value)}
                          className="pl-9"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="detailed-end-time">End Time</Label>
                      <div className="relative">
                        <Clock className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                        <Input
                          id="detailed-end-time"
                          type="time"
                          value={endTime}
                          onChange={(e) => setEndTime(e.target.value)}
                          className="pl-9"
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="detailed-location">
                    Location <span className="text-muted-foreground">(optional)</span>
                  </Label>
                  <Input
                    id="detailed-location"
                    placeholder="Conference Room A"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="detailed-link">
                    Meeting Link <span className="text-muted-foreground">(optional)</span>
                  </Label>
                  <Input
                    id="detailed-link"
                    type="url"
                    placeholder="https://meet.google.com/..."
                    value={meetingLink}
                    onChange={(e) => setMeetingLink(e.target.value)}
                  />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="detailed-participants">
                    Participants <span className="text-muted-foreground">(optional)</span>
                  </Label>
                  <Input
                    id="detailed-participants"
                    placeholder="email1@example.com, email2@example.com"
                    value={participants}
                    onChange={(e) => setParticipants(e.target.value)}
                  />
                  <p className="text-muted-foreground text-xs">Separate emails with commas</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="organizer-name">Organizer Name</Label>
                    <Input
                      id="organizer-name"
                      value={organizerName}
                      onChange={(e) => setOrganizerName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="organizer-email">Organizer Email</Label>
                    <Input
                      id="organizer-email"
                      type="email"
                      value={organizerEmail}
                      onChange={(e) => setOrganizerEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="organizer-phone">
                    Organizer Phone <span className="text-muted-foreground">(optional)</span>
                  </Label>
                  <Input
                    id="organizer-phone"
                    type="tel"
                    placeholder="+1 555-123-4567"
                    value={organizerPhone}
                    onChange={(e) => setOrganizerPhone(e.target.value)}
                  />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="detailed-description">
                    Description <span className="text-muted-foreground">(optional)</span>
                  </Label>
                  <Textarea
                    id="detailed-description"
                    placeholder="Event description..."
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="detailed-notes">
                    Notes from Organizer <span className="text-muted-foreground">(optional)</span>
                  </Label>
                  <Textarea
                    id="detailed-notes"
                    placeholder="Notes for participants..."
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                  <p className="text-muted-foreground text-xs">These notes will be visible to all participants</p>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="detailed-reminder">Reminder</Label>
                    <Select value={reminder} onValueChange={setReminder}>
                      <SelectTrigger id="detailed-reminder">
                        <SelectValue placeholder="None" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="5">5 minutes before</SelectItem>
                        <SelectItem value="15">15 minutes before</SelectItem>
                        <SelectItem value="30">30 minutes before</SelectItem>
                        <SelectItem value="60">1 hour before</SelectItem>
                        <SelectItem value="120">2 hours before</SelectItem>
                        <SelectItem value="1440">1 day before</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="detailed-timezone">Timezone</Label>
                    <Select value={timezone} onValueChange={setTimezone}>
                      <SelectTrigger id="detailed-timezone">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="GMT+7">GMT+7 Pontianak</SelectItem>
                        <SelectItem value="UTC">UTC</SelectItem>
                        <SelectItem value="GMT-5">GMT-5 EST</SelectItem>
                        <SelectItem value="GMT-8">GMT-8 PST</SelectItem>
                        <SelectItem value="GMT+1">GMT+1 CET</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="detailed-notifications"
                    checked={sendNotifications}
                    onCheckedChange={(checked) => setSendNotifications(checked === true)}
                  />
                  <Label htmlFor="detailed-notifications">Send notifications to participants</Label>
                </div>
              </TabsContent>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Create Event</Button>
            </DialogFooter>
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
