/**
 * Client settings module
 * @module client/settings
 */

/**
 * API URL
 * @constant
 * @type {String}
 */
export const API_URL = window.location.href.includes("vinil-oifa") ? "/" : "http://localhost:8080/";

/**
 * Alias for API URL
 * @constant
 * @type {String}
 */
export const SERVER_API_URL = API_URL