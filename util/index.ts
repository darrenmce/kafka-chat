export function isPromise(obj: any): boolean {
  return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
}

export function jsonToBuffer(data: object): Buffer {
  const str = JSON.stringify(data);
  return new Buffer(str);
}

export function urlToTopic(url) {
  return url.replace(/\W/g, '')
}