"use client";

import { useTranslations } from "next-intl";

export default function Preview() {
  const t = useTranslations("Dashboard.preview.homepage");
  return (
    <div className="preview mt-6 space-y-4">
      <h1 className="display text-4xl">{t("heading")}</h1>
      <h2 className="text-2xl">{t("heading")}</h2>
      <p className="text-lg">{t("body")}</p>
    </div>
  );
}
