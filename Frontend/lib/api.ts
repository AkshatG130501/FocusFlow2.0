interface ApiResponse<T> {
  data?: T;
  error?: string;
  details?: any;
}

export async function apiFetch<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(endpoint, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return {
        error: data.error || 'Something went wrong',
        details: data.details,
      };
    }

    return { data };
  } catch (error: any) {
    console.error(`API Error (${endpoint}):`, error);
    return {
      error: error.message || 'Network error occurred',
    };
  }
}
