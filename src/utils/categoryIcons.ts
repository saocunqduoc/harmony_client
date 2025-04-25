/**
 * Maps category names to emoji icons.
 * Used as a fallback when categories from the API don't have icons.
 */
export const getIconByCategory = (categoryName: string = ''): string => {
  const name = categoryName.toLowerCase();

  // Map of category names to emoji icons
  const categoryIcons: Record<string, string> = {
    'spa': '💆‍♀️',
    'massage': '🧖‍♀️',
    'nails': '💅',
    'hair': '💇‍♀️',
    'salon': '💇‍♀️',
    'facial': '👩‍⚕️',
    'yoga': '🧘‍♀️',
    'fitness': '🏋️‍♀️',
    'gym': '🏋️‍♀️',
    'makeup': '💄',
    'beauty': '✨',
    'wellness': '🌿',
    'therapy': '🧠',
    'skincare': '🧴',
    'medical': '⚕️',
    'dental': '🦷',
    'barber': '💈',
    'nutrition': '🥗',
    'coaching': '👨‍🏫'
  };
  
  // Try to find an exact match first
  if (categoryIcons[name]) {
    return categoryIcons[name];
  }
  
  // Try to find a partial match if no exact match
  const partialMatch = Object.keys(categoryIcons).find(key => name.includes(key));
  if (partialMatch) {
    return categoryIcons[partialMatch];
  }
  
  // Default icon if no match is found
  return '✨';
};