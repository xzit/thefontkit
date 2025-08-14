"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

import { presets } from "@/lib/presets";
import { useFontStore } from "@/stores/fonts";
import { useSelectedFont } from "@/stores/selected-fonts";

import { Font } from "@/components/font-combobox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { RiSparkling2Fill } from "@remixicon/react";

function generateFontFaceCSS(font: Font) {
  const css: string[] = [];

  if (font.variable) {
    // Variable fonts: subset, wght & style
    font.subsets.forEach((subset) => {
      font.styles.forEach((style) => {
        const url = `https://cdn.jsdelivr.net/fontsource/fonts/${font.id}:vf@latest/${subset}-wght-${style}.woff2`;
        css.push(`
          @font-face {
            font-family: '${font.family}';
            font-style: ${style};
            font-weight: 100 900;
            font-display: swap;
            src: url('${url}') format('woff2-variations');
          }
        `);
      });
    });
  } else {
    // Static fonts: subset, weight & style
    font.subsets.forEach((subset) => {
      font.weights.forEach((weight) => {
        font.styles.forEach((style) => {
          const url = `https://cdn.jsdelivr.net/fontsource/fonts/${font.id}@latest/${subset}-${weight}-${style}.woff2`;
          css.push(`
            @font-face {
              font-family: '${font.family}';
              font-style: ${style};
              font-weight: ${weight};
              font-display: swap;
              src: url('${url}') format('woff2');
            }
          `);
        });
      });
    });
  }

  return css.join("\n");
}

export default function Preview() {
  const t = useTranslations("Dashboard.preview.homepage");

  const { fonts } = useFontStore();
  const { selectedFont, setSelectedFont } = useSelectedFont();
  const [lastIndex, setLastIndex] = useState<number | null>(null);

  const displayFont = fonts.find((f) => f.id === selectedFont.display.fontId);
  const headingFont = fonts.find((f) => f.id === selectedFont.heading.fontId);
  const bodyFont = fonts.find((f) => f.id === selectedFont.body.fontId);

  useEffect(() => {
    const styleEl = document.createElement("style");
    styleEl.setAttribute("data-fontsource", "true");

    const allFonts = [displayFont, headingFont, bodyFont]
      .filter(Boolean)
      .filter(
        (font, index, self) =>
          self.findIndex((f) => f?.id === font?.id) === index,
      );

    const cssRules = allFonts
      .map((font) => generateFontFaceCSS(font!))
      .join("\n");

    styleEl.textContent = cssRules;
    document.head.appendChild(styleEl);

    return () => {
      document.head
        .querySelectorAll("[data-fontsource='true']")
        .forEach((el) => el.remove());
    };
  }, [selectedFont]);

  useEffect(() => {
    if (displayFont) {
      document.documentElement.style.setProperty(
        "--font-display",
        `'${displayFont.family}', sans-serif`,
      );
      document.documentElement.style.setProperty(
        "--font-display-weight",
        selectedFont.display.weight.toString(),
      );
      document.documentElement.style.setProperty(
        "--font-display-size",
        selectedFont.display.size.toString() + "px",
      );
    }
    if (headingFont) {
      document.documentElement.style.setProperty(
        "--font-heading",
        `'${headingFont.family}', sans-serif`,
      );
      document.documentElement.style.setProperty(
        "--font-heading-weight",
        selectedFont.heading.weight.toString(),
      );
      document.documentElement.style.setProperty(
        "--font-heading-size",
        selectedFont.heading.size.toString() + "px",
      );
    }
    if (bodyFont) {
      document.documentElement.style.setProperty(
        "--font-body",
        `'${bodyFont.family}', sans-serif`,
      );
      document.documentElement.style.setProperty(
        "--font-body-weight",
        selectedFont.body.weight.toString(),
      );
      document.documentElement.style.setProperty(
        "--font-body-size",
        selectedFont.body.size.toString() + "px",
      );
    }
  }, [selectedFont]);

  function randomizeFonts() {
    if (presets.length === 0) return;

    let newIndex: number;
    do {
      newIndex = Math.floor(Math.random() * presets.length);
    } while (newIndex === lastIndex && presets.length > 1);

    setLastIndex(newIndex);
    applyPreset(presets[newIndex]);
  }

  function applyPreset(preset: (typeof presets)[number]) {
    (Object.keys(preset) as Array<"display" | "heading" | "body">).forEach(
      (section) => {
        Object.entries(preset[section]).forEach(([prop, value]) => {
          setSelectedFont(section, prop as "fontId" | "weight" | "size", value);
        });
      },
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-16">
      <div className="preview mx-auto my-6 flex w-full max-w-5xl flex-col space-y-4 px-4 [&_a]:underline [&_a]:underline-offset-2 [&_a]:hover:no-underline">
        <h1 className="display">Privacy Policy</h1>
        <p>
          <strong>Last updated June 21, 2025</strong>
        </p>

        <p>
          This Privacy Policy describes how your personal information is
          collected, used, and shared when you visit or make a purchase from{" "}
          <a href="https://thefontkit.com/">https://thefontkit.com/</a> (the
          “Site”).
        </p>

        <h2>Personal information we collect</h2>

        <p>
          When you visit the Site, we automatically collect certain information
          about your device, including information about your web browser, IP
          address, time zone, and some of the cookies that are installed on your
          device. Additionally, as you browse the Site, we collect information
          about the individual web pages or products that you view, what
          websites or search terms referred you to the Site, and information
          about how you interact with the Site. We refer to this
          automatically-collected information as “Device Information.”
        </p>

        <p>We collect Device Information using the following technologies:</p>

        <ul className="marker:text-primary list-disc [&_li]:ml-6">
          <li>
            “Cookies” are data files that are placed on your device or computer
            and often include an anonymous unique identifier. For more
            information about cookies, and how to disable cookies, visit{" "}
            <a href="https://www.allaboutcookies.org/">
              https://www.allaboutcookies.org/
            </a>
            .
          </li>
          <li>
            “Log files” track actions occurring on the Site, and collect data
            including your IP address, browser type, Internet service provider,
            referring/exit pages, and date/time stamps.
          </li>
          <li>
            “Web beacons,” “tags,” and “pixels” are electronic files used to
            record information about how you browse the Site.
          </li>
        </ul>

        <p>
          Additionally when you make a purchase or attempt to make a purchase
          through the Site, we collect certain information from you, including
          your name, billing address, shipping address, payment information
          (including credit card numbers), email address, and phone number. We
          refer to this information as “Order Information.”
        </p>

        <p>
          When we talk about “Personal Information” in this Privacy Policy, we
          are talking both about Device Information and Order Information.
        </p>

        <h2>How do we use your personal information?</h2>

        <p>
          We use the Order Information that we collect generally to fulfill any
          orders placed through the Site (including processing your payment
          information, arranging for shipping, and providing you with invoices
          and/or order confirmations). Additionally, we use this Order
          Information to:
        </p>

        <ul className="marker:text-primary list-disc [&_li]:ml-6">
          <li>Communicate with you;</li>
          <li>Screen our orders for potential risk or fraud; and</li>
          <li>
            When in line with the preferences you have shared with us, provide
            you with information or advertising relating to our products or
            services.
          </li>
        </ul>

        <p>
          We use the Device Information that we collect to help us screen for
          potential risk and fraud (in particular, your IP address), and more
          generally to improve and optimize our Site (for example, by generating
          analytics about how our customers browse and interact with the Site,
          and to assess the success of our marketing and advertising campaigns).
        </p>

        <h2>Sharing your personal information</h2>

        <p>
          We share your Personal Information with third parties to help us use
          your Personal Information, as described above. We use Google Analytics
          to help us understand how our customers use the Site--you can read
          more about how Google uses your Personal Information here:{" "}
          <a href="https://www.google.com/intl/en/policies/privacy/">
            https://www.google.com/intl/en/policies/privacy/
          </a>
          . You can also opt-out of Google Analytics here:{" "}
          <a href="https://tools.google.com/dlpage/gaoptout">
            https://tools.google.com/dlpage/gaoptout
          </a>
          .
        </p>

        <p>
          Finally, we may also share your Personal Information to comply with
          applicable laws and regulations, to respond to a subpoena, search
          warrant or other lawful request for information we receive, or to
          otherwise protect our rights.
        </p>

        <h2>Behavioural advertising</h2>

        <p>
          As described above, we use your Personal Information to provide you
          with targeted advertisements or marketing communications we believe
          may be of interest to you. For more information about how targeted
          advertising works, you can visit the Network Advertising Initiative’s
          (“NAI”) educational page at{" "}
          <a href="https://www.networkadvertising.org/understanding-online-advertising/how-does-it-work">
            https://www.networkadvertising.org/understanding-online-advertising/how-does-it-work
          </a>
          .
        </p>

        <p>
          Additionally, you can opt out of some of these services by visiting
          the Digital Advertising Alliance’s opt-out portal at:{" "}
          <a href="https://optout.aboutads.info/">
            https://optout.aboutads.info/
          </a>
          .
        </p>

        <h2>Do not track</h2>

        <p>
          Please note that we do not alter our Site’s data collection and use
          practices when we see a Do Not Track signal from your browser.
        </p>

        <h2>Your rights</h2>

        <p>
          If you are a European resident, you have the right to access personal
          information we hold about you and to ask that your personal
          information be corrected, updated, or deleted. If you would like to
          exercise this right, please contact us through the contact information
          below.
        </p>

        <p>
          Additionally, if you are a European resident we note that we are
          processing your information in order to fulfill contracts we might
          have with you (for example if you make an order through the Site), or
          otherwise to pursue our legitimate business interests listed above.
          Additionally, please note that your information will be transferred
          outside of Europe, including to Canada and the United States.
        </p>

        <h2>Data retention</h2>

        <p>
          When you place an order through the Site, we will maintain your Order
          Information for our records unless and until you ask us to delete this
          information.
        </p>

        <h2>Minors</h2>

        <p>The Site is not intended for individuals under the age of 18.</p>

        <h2>Changes</h2>

        <p>
          We may update this privacy policy from time to time in order to
          reflect, for example, changes to our practices or for other
          operational, legal or regulatory reasons.
        </p>

        <h2>Contact us</h2>

        <p>
          For more information about our privacy practices, if you have
          questions, or if you would like to make a complaint, please contact us
          by e-mail at <a href="mailto:hi@xzit.dev">hi@xzit.dev</a>.
        </p>
      </div>
    </div>
  );
}
