import { revalidatePath, revalidateTag } from "next/cache";

export function revalidateSite(paths: string[] = []) {
  revalidateTag("cms", "max");
  revalidatePath("/", "layout");
  revalidatePath("/sitemap.xml");
  for (const path of paths) {
    revalidatePath(path);
  }
}
