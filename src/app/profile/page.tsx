import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = { title: "マイページ" };

export default function Page() {
  return <ComingSoon title="マイページ" />;
}
