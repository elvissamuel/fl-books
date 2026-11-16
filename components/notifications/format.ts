const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const typeLabels: Record<string, string> = {
  NEW_PAID_ORDER: "New paid order",
  PURCHASE_SUCCESSFUL: "Purchase successful",
};

export function notificationTypeLabel(type: string) {
  if (typeLabels[type]) return typeLabels[type];
  return type
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function formatNotificationTime(value: string) {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);
  if (!match) return value;
  const month = months[Number(match[2]) - 1];
  if (!month) return value;
  const day = Number(match[3]);
  const rawHour = Number(match[4]);
  const suffix = rawHour >= 12 ? "PM" : "AM";
  const hour = rawHour % 12 || 12;
  return `${month} ${day}, ${hour}:${match[5]} ${suffix}`;
}
