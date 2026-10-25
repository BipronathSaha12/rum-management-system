import time
from django.utils import timezone


class RequestExecutionTimeMiddleware:
    """Middleware to log request method, path, timestamp, and execution duration in milliseconds."""

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        start_time = time.time()
        response = self.get_response(request)
        duration_ms = (time.time() - start_time) * 1000
        timestamp = timezone.now().strftime("%Y-%m-%d %H:%M:%S")
        print(
            f"[{timestamp}] {request.method} {request.get_full_path()} - "
            f"Status: {response.status_code} - Execution Time: {duration_ms:.2f}ms"
        )
        return response

