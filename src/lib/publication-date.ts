// Publication dates are calendar dates in Korea, independent of the server's TZ.
export function getKstDateString(now: Date = new Date()): string {
  return new Date(now.getTime() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

export function isPublicationDateReached(publishDate: string, now: Date = new Date()): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(publishDate) && publishDate <= getKstDateString(now);
}
