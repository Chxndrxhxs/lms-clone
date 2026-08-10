import os

from django.conf import settings
from rest_framework import viewsets, status
from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response

from .models import Course
from .serializers import CourseSerializer


class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.prefetch_related("chapters__items").all()
    serializer_class = CourseSerializer


@api_view(["POST"])
@parser_classes([MultiPartParser, FormParser])
def upload_file(request):
    file = request.FILES.get("file")
    if not file:
        return Response({"error": "No file provided"}, status=status.HTTP_400_BAD_REQUEST)

    upload_dir = os.path.join(settings.MEDIA_ROOT, "uploads")
    os.makedirs(upload_dir, exist_ok=True)

    name = os.path.basename(file.name)
    destination = os.path.join(upload_dir, name)

    # avoid collisions
    base, ext = os.path.splitext(name)
    counter = 1
    while os.path.exists(destination):
        destination = os.path.join(upload_dir, f"{base}_{counter}{ext}")
        counter += 1

    with open(destination, "wb+") as f:
        for chunk in file.chunks():
            f.write(chunk)

    url_path = f"{settings.MEDIA_URL}uploads/{os.path.basename(destination)}"
    return Response(
        {
            "url": url_path,
            "name": os.path.basename(destination),
            "size": file.size,
            "type": file.content_type,
        },
        status=status.HTTP_201_CREATED,
    )
