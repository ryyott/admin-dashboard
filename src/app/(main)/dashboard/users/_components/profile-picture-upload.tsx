"use client";

import { useState, useRef } from "react";

import { Upload, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface ProfilePictureUploadProps {
  currentAvatar?: string;
  userName: string;
  onUpload: (file: File) => void;
}

export function ProfilePictureUpload({ currentAvatar, userName, onUpload }: ProfilePictureUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Simulate upload with animation
    setIsUploading(true);
    setUploadSuccess(false);

    // Simulate API call
    setTimeout(() => {
      setIsUploading(false);
      setUploadSuccess(true);
      onUpload(file);

      // Reset success message after 3 seconds
      setTimeout(() => {
        setUploadSuccess(false);
      }, 3000);
    }, 2000);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemovePreview = () => {
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-4">
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="profile">Profile Photo</TabsTrigger>
          <TabsTrigger value="member">Member Card</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6 space-y-6">
          <div className="flex flex-col items-center justify-center py-8">
            {/* Avatar Display with Loading Animation */}
            <div className="relative">
              <AnimatePresence mode="wait">
                {isUploading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="relative"
                  >
                    <div className="from-primary via-primary/90 to-primary/80 flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br">
                      {/* Animated loading ring */}
                      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100">
                        <motion.circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeDasharray="20 10"
                          className="text-primary-foreground"
                          initial={{ rotate: 0 }}
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          style={{ originX: "50%", originY: "50%" }}
                        />
                      </svg>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="avatar"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Avatar className="h-32 w-32">
                      <AvatarImage src={previewUrl || currentAvatar} alt={userName} />
                      <AvatarFallback className="text-3xl">{getInitials(userName)}</AvatarFallback>
                    </Avatar>
                    {previewUrl && (
                      <button
                        onClick={handleRemovePreview}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90 absolute -top-2 -right-2 rounded-full p-1 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Upload Button */}
            <div className="mt-6">
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
              <Button variant="outline" onClick={handleButtonClick} disabled={isUploading}>
                <Upload className="mr-2 h-4 w-4" />
                Change profile image
              </Button>
            </div>

            {/* Helper Text */}
            <p className="text-muted-foreground mt-4 max-w-sm text-center text-sm">
              Ideally upload a portrait photo with a clear background for best results on your personalized member card.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="member" className="mt-6 space-y-6">
          <div className="flex flex-col items-center justify-center py-8">
            {/* Member Card Preview */}
            <div className="from-primary via-primary/90 to-primary/80 border-border/50 relative aspect-[2/3] w-full max-w-sm overflow-hidden rounded-2xl border bg-gradient-to-br shadow-2xl">
              {/* User Image */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform">
                <Avatar className="border-primary-foreground/20 h-32 w-32 border-4">
                  <AvatarImage src={previewUrl || currentAvatar} alt={userName} />
                  <AvatarFallback className="bg-primary-foreground/20 text-primary-foreground text-3xl">
                    {getInitials(userName)}
                  </AvatarFallback>
                </Avatar>
                <div className="bg-primary-foreground/10 absolute inset-0 flex items-center justify-center rounded-full opacity-0 transition-opacity hover:opacity-100">
                  <Upload className="text-primary-foreground h-8 w-8" />
                </div>
              </div>

              {/* User Name */}
              <div className="absolute right-6 bottom-6 left-6 text-center">
                <h4 className="text-primary-foreground text-xl font-semibold">{userName}</h4>
                <p className="text-primary-foreground/80 mt-1 text-sm">Member Card</p>
              </div>

              {/* Decorative elements */}
              <div className="bg-primary-foreground/10 absolute top-0 right-0 h-32 w-32 rounded-full blur-3xl" />
              <div className="bg-primary-foreground/10 absolute bottom-0 left-0 h-24 w-24 rounded-full blur-2xl" />
            </div>

            {/* Upload Button */}
            <div className="mt-6">
              <Button variant="outline" onClick={handleButtonClick} disabled={isUploading}>
                <Upload className="mr-2 h-4 w-4" />
                Change profile image
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Success Message */}
      <AnimatePresence>
        {uploadSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex items-center justify-center gap-2 rounded-lg bg-green-500/10 px-4 py-2 text-green-600 dark:text-green-400"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-sm font-medium">Uploaded image successfully</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
