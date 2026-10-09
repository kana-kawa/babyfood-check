import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = { title: "アレルギー対応マニュアル" };

export default function Page() {
  return <ComingSoon title="アレルギー対応マニュアル" />;
}
