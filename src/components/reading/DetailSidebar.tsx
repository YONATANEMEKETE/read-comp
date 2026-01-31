"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import NoteContent from "./NoteContent";
import QuoteContent from "./QuoteContent";

type TabType = "notes" | "quotes" | "stories";

interface DetailSidebarProps {
  bookId?: string;
}

const DetailSidebar = ({ bookId }: DetailSidebarProps) => {
  const [activeTab, setActiveTab] = useState<TabType>("notes");

  const tabs = [
    { id: "notes" as TabType, label: "Notes" },
    { id: "quotes" as TabType, label: "Quotes" },
    { id: "stories" as TabType, label: "Stories" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "notes":
        return <NoteContent bookId={bookId} />;
      case "quotes":
        return <QuoteContent bookId={bookId} />;
      case "stories":
        return (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            Stories content coming soon...
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <aside className="w-full h-full bg-card dark:bg-sidebar-dark border-l border-sepia-divider dark:border-border flex flex-col shadow-soft z-20">
      {/* Tab Navigation */}
      <div className="flex items-end px-6 pt-6 pb-0 border-b border-sepia-divider/50 dark:border-sidebar-border/50 shrink-0">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            variant="ghost"
            size="sm"
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "relative pb-3 pt-2 px-4 text-sm font-semibold transition-all duration-200 rounded-none h-auto bg-transparent hover:bg-transparent cursor-pointer",
              activeTab === tab.id
                ? "text-primary hover:text-primary"
                : "text-muted-foreground hover:text-foreground dark:hover:text-foreground"
            )}
          >
            {tab.label}
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary" />
            )}
          </Button>
        ))}
      </div>

      {/* Tab Content Area */}
      <div className="flex-1 overflow-hidden">
        {renderContent()}
      </div>
    </aside>
  );
};

export default DetailSidebar;
