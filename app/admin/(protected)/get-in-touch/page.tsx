import { redirect } from "next/navigation";

export default function GetInTouchPage() {
  redirect("/admin/audience?tab=get-in-touch");
}
