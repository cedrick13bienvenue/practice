export const generateSlug = (title: string): string => {
  return title.trim().split(' ').join('-').toLowerCase();
};
