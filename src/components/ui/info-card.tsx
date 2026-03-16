"use client"

import { Star, MessageCircle, UserPlus } from "lucide-react"
import { cn } from "@/lib/utils"

export type ProfileCardProps = {
  name: string
  role: string
  status: "online" | "offline" | "away"
  avatar: string
  tags?: string[]
  isVerified?: boolean
  followers?: number
}

export default function ProfileCard({ name, role, status, avatar, tags = [], isVerified, followers }: ProfileCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-3xl bg-transparent p-6 w-full h-full transition-all duration-500 hover:scale-[1.02]">
      {/* Status indicator with pulse animation */}
      <div className="absolute right-4 top-4 z-10">
        <div className="relative">
          <div
            className={cn(
              "h-3 w-3 rounded-full border-2 border-background transition-all duration-300 group-hover:scale-125",
              status === "online"
                ? "bg-green-500 group-hover:shadow-[0_0_20px_rgba(34,197,94,0.6)]"
                : status === "away"
                  ? "bg-amber-500"
                  : "bg-gray-400",
            )}
          ></div>
          {status === "online" && (
            <div className="absolute inset-0 h-3 w-3 rounded-full bg-green-500 animate-ping opacity-30"></div>
          )}
        </div>
      </div>

      {/* Verified badge with bounce animation */}
      {isVerified && (
        <div className="absolute right-4 top-10 z-10">
          <div className="rounded-full bg-primary p-1 shadow-[0_0_10px_rgba(var(--primary),0.5)] transition-all duration-300 group-hover:scale-110 group-hover:rotate-12">
            <Star className="h-3 w-3 fill-primary-foreground text-primary-foreground" />
          </div>
        </div>
      )}

      {/* Profile Photo with enhanced hover effects */}
      <div className="mb-4 flex justify-center relative z-10">
        <div className="relative group-hover:animate-pulse">
          <div className="h-28 w-28 overflow-hidden rounded-full p-1 liquid-panel transition-all duration-500 group-hover:scale-110">
            <img
              src={avatar}
              alt={name}
              className="h-full w-full rounded-full object-contain transition-transform duration-500 group-hover:scale-105 ethereal-image"
            />
          </div>
          {/* Glowing ring on hover */}
          <div className="absolute inset-0 rounded-full border-2 border-primary/50 opacity-0 group-hover:opacity-100 transition-all duration-500 animate-pulse"></div>
        </div>
      </div>

      {/* Profile Info with slide-up animation */}
      <div className="text-center relative z-10 transition-transform duration-300 group-hover:-translate-y-1">
        <h3 className="text-lg font-semibold ethereal-text transition-colors duration-300 group-hover:text-primary">
          {name}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground ethereal-text transition-colors duration-300">
          {role}
        </p>

        {followers && (
          <p className="mt-2 text-xs text-muted-foreground transition-all duration-300 group-hover:text-primary group-hover:font-medium ethereal-text">
            {followers.toLocaleString()} followers
          </p>
        )}
      </div>

      {/* Tags with bounce animation */}
      {tags.length > 0 && (
        <div className="mt-4 flex justify-center gap-2 relative z-10">
          {tags.map((tag, i) => (
            <span
              key={i}
              className={cn(
                "inline-block rounded-full px-3 py-1 text-xs font-medium liquid-panel transition-all duration-300 ethereal-text",
                tag === "Premium"
                  ? "text-primary group-hover:scale-105"
                  : "text-muted-foreground group-hover:scale-105",
              )}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Action Buttons with enhanced hover effects and increased height */}
      <div className="mt-6 flex gap-2 relative z-10">
        <button className="flex-1 rounded-full py-4 text-sm font-medium text-primary liquid-panel transition-all duration-300 hover:scale-95 active:scale-90 ethereal-text">
          <UserPlus className="mx-auto h-4 w-4 transition-transform duration-300 hover:scale-110" />
        </button>
        <button className="flex-1 rounded-full py-4 text-sm font-medium text-primary liquid-panel transition-all duration-300 hover:scale-95 active:scale-90 ethereal-text">
          <MessageCircle className="mx-auto h-4 w-4 transition-transform duration-300 hover:scale-110" />
        </button>
      </div>

      {/* Animated border on hover */}
      <div className="absolute inset-0 rounded-3xl border border-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
    </div>
  )
}
