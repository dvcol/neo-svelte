export type MarkAndToken = { mark: string | false; token: string };
export type MarkTokenizer = (str?: string, pattern?: string, flags?: string) => MarkAndToken[];
export const markTokenizer: MarkTokenizer = (str = '', pattern, flags = 'gi') => {
  if (!pattern?.trim()) return [{ mark: false, token: str }];
  // Case-insensitive with capturing
  const regex = new RegExp(`(${pattern.trim()})`, flags);
  const result: MarkAndToken[] = [];

  let lastIndex = 0;
  str.replace(regex, (match, group, offset) => {
    // If no group, ignore result
    if (!group) return '';
    // Push the text before + match
    result.push({ mark: group, token: str.slice(lastIndex, offset) });
    // Update lastIndex to move past the match
    lastIndex = offset + group.length;
    return '';
  });
  // Push the remaining text
  result.push({ mark: false, token: str.slice(lastIndex) });
  return result;
};
