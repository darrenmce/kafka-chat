export function getAPIHost() {
  if (process.env.REACT_APP_API) {
    return process.env.REACT_APP_API;
  }
  return window.document.location.host.replace(/:.*/, '');
}