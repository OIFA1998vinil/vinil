/**
 * Client locations module
 * @module client/locations
 */

/**
 * Home Page location
 * @returns {String} path
 */
export const HOME_PAGE = () => '/';

/**
 * Page Not found location
 * @returns {String} path
 */
export const NOT_FOUND = () => '/404';

/**
 * Admin sign in location
 * @returns {String} path
 */
export const ADMIN_SIGN_IN = () => '/admin/iniciar-sesion';

/**
 * Clients sign in location
 * @returns {String} path
 */
export const SIGN_IN = () => '/iniciar-sesion';

/**
 * Admin landing page location
 * @returns {String} path
 */
export const ADMIN_LANDING = () => '/admin';

/**
 * Admin songs page location
 * @returns {String} path
 */
export const ADMIN_SONGS = () => '/admin/canciones';

/**
 * Admin users request page location
 * @returns {String} path
 */
export const ADMIN_REQUESTS_USERS = () => '/admin/solicitudes/usuarios';

/**
 * Admin pending songs page location
 * @returns {String} path
 */
export const ADMIN_PENDING_SONGS = () => '/admin/solicitudes/canciones';

/**
 * Admin add song page location
 * @returns {String} path
 */
export const ADD_SONG = () => '/admin/canciones/agregar';

/**
 * Client sign up page location
 * @returns {String} path
 */
export const SIGN_UP = () => '/registro';

/**
 * Admin users page location
 * @returns {String} path
 */
export const ADMIN_USERS = () => '/admin/users';

/**
 * Admin collaborators page location
 * @returns {String} path
 */
export const ADMIN_COLLABORATORS = () => '/admin/colaboradores';

/**
 * Admin add collaborators page location
 * @returns {String} path
 */
export const ADMIN_ADD_COLLABORATORS = () => '/admin/colaboradores/agregar';

/**
 * Collaboratos sign in page location
 * @returns {String} path
 */
export const COLLAB_SIGN_IN = () => '/colaboradores/iniciar-sesion';

/**
 * Collaborators landing page location
 * @returns {String} path
 */
export const COLLAB_LANDING = () => '/colaboradores';

/**
 * Collaborators add song page location
 * @returns {String} path
 */
export const COLLAB_ADD_SONG = () => '/colaboradores/canciones/agregar';

/**
 * Collaborators pending songs page location
 * @returns {String} path
 */
export const COLLAB_PENDING_SONGS = () => '/colaboradores/canciones/pendientes';