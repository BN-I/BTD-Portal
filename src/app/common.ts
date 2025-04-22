export function formatDate(createdAt: string): string {
  const date = new Date(createdAt);

  // Get individual components of the date
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based, so add 1
  const day = String(date.getDate()).padStart(2, "0"); // Ensure two digits for day

  // Combine them into the 'YYYY-MM-DD' format
  const formattedDate = `${year}-${month}-${day}`;
  return formattedDate;
}

export function isValidHttpUrl(url: string) {
  let validURL;

  try {
    validURL = new URL(url);
  } catch (_) {
    return false;
  }

  return validURL.protocol === "http:" || validURL.protocol === "https:";
}

export function trimWithEllipsis(str: string, maxLength: number) {
  return str.length > maxLength ? str.slice(0, maxLength - 3) + "..." : str;
}
