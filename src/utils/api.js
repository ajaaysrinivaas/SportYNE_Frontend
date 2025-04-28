const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * Fetch all subtopics for a given space (e.g., Anatomy, Nutrition).
 * @param {string} space - The name of the space (e.g., "anatomy", "nutrition").
 * @returns {Promise<Object[]>} - List of subtopics.
 */
export const fetchSubtopics = async (space) => {
  const response = await fetch(`${API_BASE_URL}/api/${space}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch subtopics for ${space}`);
  }
  return response.json();
};

/**
 * Fetch detailed content for a specific subtopic by ID within a space.
 * @param {string} space - The name of the space (e.g., "anatomy", "nutrition").
 * @param {string} id - The ID of the subtopic to fetch.
 * @returns {Promise<Object>} - Subtopic details.
 */
export const fetchDetail = async (space, id) => {
  const response = await fetch(`${API_BASE_URL}/api/${space}/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch details for ${space} subtopic ID: ${id}`);
  }
  return response.json();
};
