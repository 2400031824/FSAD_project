const apiBaseUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, "");

if (apiBaseUrl && typeof window !== "undefined") {
  const nativeFetch = window.fetch.bind(window);

  window.fetch = (input: RequestInfo | URL, init?: RequestInit) => {
    if (typeof input === "string" && input.startsWith("/api/")) {
      return nativeFetch(`${apiBaseUrl}${input}`, init);
    }

    if (input instanceof Request && input.url.startsWith(`${window.location.origin}/api/`)) {
      const url = input.url.replace(window.location.origin, apiBaseUrl);
      return nativeFetch(new Request(url, input), init);
    }

    return nativeFetch(input, init);
  };
}
