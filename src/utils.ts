/**
 * utilities
 * @author Thomas Thron
 */

/**
 * helper to yield a json with a specific format
 * @param url file location
 */

export async function loadJsonFile<T>(url: string): Promise<T> {

  const promise = new Promise<T>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.responseType = "json";
    xhr.onreadystatechange = (bla: Event) => {
      if (xhr.readyState === 4 && xhr.status === 200) {
        const parsed = xhr.response as T;
        resolve(parsed);
      }
    };
    xhr.onerror = () => reject(xhr.statusText);
    xhr.open("GET", url);
    xhr.send();
  });
  return promise;
}