import { API_IN_BROWSER } from "./flags";
import { handleLocally } from "./local";

/**
 * fetch() for the desk API. Goes over the network to the route handlers in a server deployment;
 * in the static build it is answered in the browser by the same handlers. Call sites are unchanged.
 */
export function deskFetch(path: string, init?: RequestInit): Promise<Response> {
  return API_IN_BROWSER ? handleLocally(path, init) : fetch(path, init);
}
