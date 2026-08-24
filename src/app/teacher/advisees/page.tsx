import { redirect } from "next/navigation";

export default function TeacherAdviseesRedirect() {
  redirect("/teacher?tab=advisees");
}
