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

export function isValidEmail(email: string): RegExpMatchArray | null {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
}

export function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
}
