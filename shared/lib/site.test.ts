import { describe, expect, it } from "vitest";

import { channels, mailHref, ownerEmail } from "./site";

describe("mailHref", () => {
  it("gives no link while the address is a placeholder", () => {
    expect(mailHref("[email]")).toBeNull();
  });

  it("links a real address", () => {
    expect(mailHref("hi@mluk.dev")).toBe("mailto:hi@mluk.dev");
  });

  // Both sides are `null` while `ownerEmail` is a placeholder; the case turns
  // red once the address is real and the channel's `href` is not wired to it.
  it("is where the email channel takes its link from", () => {
    expect(channels.email.href).toBe(mailHref(ownerEmail));
  });
});
