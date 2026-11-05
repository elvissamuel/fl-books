export function naira(value: number) {
  const digits = Math.round(value).toString();
  return `N${digits.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
}

export function cartCover(urls: string[]) {
  return urls.find((url) => url.startsWith("https://")) ?? "";
}
