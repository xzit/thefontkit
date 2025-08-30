import Link from "next/link";

import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("AppLayout.footer");

  return (
    <footer className="mx-auto flex w-full flex-col items-center justify-center gap-8 border-t py-8 text-center text-xs md:flex-row md:justify-between">
      <div className="flex flex-col-reverse items-center gap-2 md:flex-row">
        <span>
          © {new Date().getFullYear()} {t("name")}. {t("all-rights")}
        </span>
        <Link
          href="/privacy"
          className="hover:text-foreground underline hover:no-underline"
        >
          {t("privacy")}
        </Link>
      </div>
      <div className="flex items-center gap-2">
        <span>
          {t.rich("credits", {
            link: (chunks) => (
              <Link
                href="https://xzit.dev/?ref=thefontkit.com"
                target="_blank"
                className="underline hover:no-underline"
              >
                {chunks}
              </Link>
            ),
          })}
        </span>
      </div>
    </footer>
  );
}
