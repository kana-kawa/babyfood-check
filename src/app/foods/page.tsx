import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = { title: "食材" };

export default function Page() {
  return <ComingSoon title="食材" />;
}
