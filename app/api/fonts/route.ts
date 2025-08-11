import { getTranslations } from "next-intl/server";

export async function GET() {
  const t = await getTranslations({
    locale: "en",
    namespace: "Response.fonts",
  });
  const res = await fetch("https://api.fontsource.org/v1/fonts", {
    next: { revalidate: 60 * 60 * 24 },
  });

  if (!res.ok) {
    return Response.json({ error: t("error") }, { status: 500 });
  }

  const data = await res.json();

  return Response.json(data);
}
