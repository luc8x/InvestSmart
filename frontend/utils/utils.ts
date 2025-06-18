export const getInitials = (name: string) => {
  if (!name) return '';
  const words = name.trim().split(' ');

  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase();
  }

  const first = words[0].charAt(0).toUpperCase();
  const last = words[words.length - 1].charAt(0).toUpperCase();

  return `${first}${last}`;
};