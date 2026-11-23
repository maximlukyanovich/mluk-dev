import { describe, expect, it } from "vitest";

import { contactPageJsonLd } from "./structured-data";

describe("contactPageJsonLd", () => {
  it("describes the contact page, about the site's Person", () => {
    expect(contactPageJsonLd("ru")).toEqual({
      "@context": "https://schema.org",
      "@type": "ContactPage",
      url: "https://mluk.dev/ru/contact",
      inLanguage: "ru",
      mainEntity: {
        "@type": "Person",
        "@id": "https://mluk.dev/#person",
        sameAs: [
          "https://github.com/maximlukyanovich",
          "https://www.linkedin.com/in/mlukyanovich",
          "https://t.me/MaximLukyanovich",
        ],
      },
    });
  });

  it("gives the email once there is a real address", () => {
    expect(contactPageJsonLd("en", "hi@mluk.dev").mainEntity).toMatchObject({
      email: "hi@mluk.dev",
    });
  });
});
