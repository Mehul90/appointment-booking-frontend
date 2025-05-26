
/**
 * Environment settings object containing configuration values.
 * @typedef {Object} EnvSettings
 * @property {string} apiURL - The base URL for the API, sourced from environment variables.
 */
const envSettings = {
    apiURL: import.meta.env.VITE_API_BASE_URL
};

export { envSettings };

