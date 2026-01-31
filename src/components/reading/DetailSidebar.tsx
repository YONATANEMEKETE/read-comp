"use client";

import React from "react";
import { cn } from "@/lib/utils";
import NoteContent from "./NoteContent";
import QuoteContent from "./QuoteContent";
import StoryContent from "./StoryContent";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DetailSidebarProps {
  bookId?: string;
}

const DetailSidebar = ({ bookId }: DetailSidebarProps) => {
  return (
    <aside className="w-full h-full bg-card dark:bg-sidebar-dark border-l border-sepia-divider dark:border-border flex flex-col shadow-soft z-20">
      <Tabs defaultValue="notes" className="flex flex-col flex-1 h-full">
        {/* Tab Navigation */}
        <div className="px-6 pt-6 border-b border-sepia-divider/50 dark:border-sidebar-border/50 shrink-0">
          <TabsList className="bg-transparent p-0 h-auto gap-0 w-full justify-start rounded-none">
            <TabsTrigger
              value="notes"
              className="relative pb-3 pt-2 px-4 text-sm font-semibold transition-all duration-200 rounded-none h-auto bg-transparent data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none text-muted-foreground hover:text-foreground dark:hover:text-foreground cursor-pointer group"
            >
              Notes
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary scale-x-0 group-data-[state=active]:scale-x-100 transition-transform duration-200" />
            </TabsTrigger>
            <TabsTrigger
              value="quotes"
              className="relative pb-3 pt-2 px-4 text-sm font-semibold transition-all duration-200 rounded-none h-auto bg-transparent data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none text-muted-foreground hover:text-foreground dark:hover:text-foreground cursor-pointer group"
            >
              Quotes
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary scale-x-0 group-data-[state=active]:scale-x-100 transition-transform duration-200" />
            </TabsTrigger>
            <TabsTrigger
              value="stories"
              className="relative pb-3 pt-2 px-4 text-sm font-semibold transition-all duration-200 rounded-none h-auto bg-transparent data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none text-muted-foreground hover:text-foreground dark:hover:text-foreground cursor-pointer group"
            >
              Stories
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary scale-x-0 group-data-[state=active]:scale-x-100 transition-transform duration-200" />
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab Content Area */}
        <div className="flex-1 overflow-hidden relative">
          <TabsContent value="notes" forceMount className="h-full m-0 data-[state=inactive]:hidden">
            <NoteContent bookId={bookId} />
          </TabsContent>
          <TabsContent value="quotes" forceMount className="h-full m-0 data-[state=inactive]:hidden">
            <QuoteContent bookId={bookId} />
          </TabsContent>
          <TabsContent value="stories" forceMount className="h-full m-0 data-[state=inactive]:hidden">
            <StoryContent bookId={bookId} />
          </TabsContent>
        </div>
      </Tabs>
    </aside>
  );
};

export default DetailSidebar;
