interface ErrorLogData {
  message: string;
  stack?: string;
  context?: any;
  url?: string;
  userAgent?: string;
  userId?: string;
  userEmail?: string;
}

export async function logError(data: ErrorLogData) {
  try {
    const response = await fetch('/api/logs/error', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
        url: data.url || window.location.href,
        userAgent: data.userAgent || navigator.userAgent,
      }),
    });
    return await response.json();
  } catch (e) {
    console.error('Failed to send error log to server', e);
  }
}

export function initGlobalErrorLogging() {
  window.addEventListener('error', (event) => {
    logError({
      message: event.message,
      stack: event.error?.stack,
      url: window.location.href,
      context: {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      }
    });
  });

  window.addEventListener('unhandledrejection', (event) => {
    logError({
      message: 'Unhandled Rejection: ' + String(event.reason),
      stack: event.reason?.stack,
      url: window.location.href,
      context: {
        reason: event.reason,
      }
    });
  });
}
