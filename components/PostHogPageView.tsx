"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";
import posthog from "posthog-js";

function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname) {
      let url = window.origin + pathname;
      const search = searchParams.toString();
      if (search) url += `?${search}`;
      posthog.capture("$pageview", { $current_url: url });
    }
  }, [pathname, searchParams]);

  return null;
}

export default function PostHogPageView() {
  return (
    <Suspense fallback={null}>
      <PageViewTracker />
    </Suspense>
  );
}
