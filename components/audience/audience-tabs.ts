export const audienceTabs = [
  { id: "get-in-touch", label: "Get in Touch" },
  { id: "testimonials", label: "Testimonials" },
  { id: "newsletter", label: "Newsletter" },
] as const;

export type AudienceTab = (typeof audienceTabs)[number]["id"];

export function isAudienceTab(value: string | undefined): value is AudienceTab {
  return audienceTabs.some((tab) => tab.id === value);
}
