"use client";

import { Calendar, Code, FileText, User, Clock } from "lucide-react";
import RadialOrbitalTimeline from "@/components/ui/radial-orbital-timeline";
import { useEffect, useState } from "react";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "@/firebase";
import { handleFirestoreError, OperationType } from "@/lib/firestore-errors";

const defaultTimelineData = [
  {
    id: 1,
    title: "Market Analysis",
    date: "Jan 2024",
    content: "Analyzing industry landscape and identifying market segments.",
    category: "Planning",
    icon: Calendar,
    relatedIds: [2],
    status: "completed" as const,
    energy: 100,
  },
  {
    id: 2,
    title: "Prospecting",
    date: "Feb 2024",
    content: "Hunting for potential buyers across available channels.",
    category: "Design",
    icon: FileText,
    relatedIds: [1, 3],
    status: "completed" as const,
    energy: 90,
  },
  {
    id: 3,
    title: "Lead Qualification",
    date: "Mar 2024",
    content: "Evaluating prospects against qualification criteria.",
    category: "Development",
    icon: Code,
    relatedIds: [2, 4],
    status: "in-progress" as const,
    energy: 60,
  },
  {
    id: 4,
    title: "Outreach",
    date: "Apr 2024",
    content: "Crafting personalized outreach messages.",
    category: "Testing",
    icon: User,
    relatedIds: [3, 5],
    status: "pending" as const,
    energy: 30,
  },
  {
    id: 5,
    title: "Closing",
    date: "May 2024",
    content: "Negotiating and closing deals.",
    category: "Release",
    icon: Clock,
    relatedIds: [4],
    status: "pending" as const,
    energy: 10,
  },
];

export function RadialOrbitalTimelineDemo() {
  const [timelineData, setTimelineData] = useState<any[]>(defaultTimelineData);

  useEffect(() => {
    const q = query(collection(db, "timeline"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const loadedData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setTimelineData(loadedData.length > 0 ? loadedData : defaultTimelineData);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, "timeline");
    });
    return () => unsubscribe();
  }, []);

  return (
    <RadialOrbitalTimeline timelineData={timelineData} />
  );
}
