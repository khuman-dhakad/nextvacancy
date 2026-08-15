"use client";

import React, { useState, useMemo } from "react";
import {
  NotificationItem,
  NotificationCategory,
  NotificationTag,
} from "@/services/notifications/notification.service";
import { NotificationHeader } from "./NotificationHeader";
import { NotificationTabs } from "./NotificationTabs";
import { NotificationFilters } from "./NotificationFilters";
import { NotificationCard } from "./NotificationCard";
import { EmptyState } from "./EmptyState";

export interface NotificationListProps {
  initialNotifications: NotificationItem[];
  className?: string;
}

export const NotificationList: React.FC<NotificationListProps> = ({
  initialNotifications = [],
  className = "",
}) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [activeTab, setActiveTab] = useState<NotificationCategory>("ALL");
  const [selectedTag, setSelectedTag] = useState<NotificationTag | "ALL">("ALL");

  // Tab counts
  const tabCounts = useMemo(() => {
    return {
      ALL: notifications.length,
      JOBS: notifications.filter((n) => n.category === "JOBS").length,
      RESULTS: notifications.filter((n) => n.category === "RESULTS").length,
      ADMIT_CARDS: notifications.filter((n) => n.category === "ADMIT_CARDS").length,
      SCHOLARSHIPS: notifications.filter((n) => n.category === "SCHOLARSHIPS").length,
    };
  }, [notifications]);

  const unreadCount = useMemo(() => {
    return notifications.filter((n) => !n.isRead).length;
  }, [notifications]);

  // Filtered notification stream
  const filteredNotifications = useMemo(() => {
    return notifications.filter((item) => {
      const matchesTab = activeTab === "ALL" || item.category === activeTab;
      const matchesTag = selectedTag === "ALL" || item.tag === selectedTag;
      return matchesTab && matchesTag;
    });
  }, [notifications, activeTab, selectedTag]);

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  return (
    <div className={["space-y-6", className].filter(Boolean).join(" ")}>
      {/* Header with live unread counts & mark all read trigger */}
      <NotificationHeader
        totalCount={notifications.length}
        unreadCount={unreadCount}
        onMarkAllRead={handleMarkAllRead}
      />

      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
        {/* Category Tabs */}
        <NotificationTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          counts={tabCounts}
        />

        {/* Sector Filter Chips */}
        <NotificationFilters
          selectedTag={selectedTag}
          onTagSelect={setSelectedTag}
        />

        {/* Notification Stream Feed */}
        {filteredNotifications.length > 0 ? (
          <div className="space-y-3.5">
            {filteredNotifications.map((item) => (
              <NotificationCard
                key={item.id}
                notification={item}
                onMarkAsRead={handleMarkAsRead}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No Notifications Match Your Filter"
            description="Try changing the category tab or sector filter to view all gazette circulars."
            actionLabel="Reset All Filters"
            actionHref="#notification-feed"
          />
        )}
      </div>
    </div>
  );
};

NotificationList.displayName = "NotificationList";
