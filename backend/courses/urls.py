from django.urls import path
from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter()
router.register("courses", views.CourseViewSet, basename="course")

urlpatterns = [
    path("upload/", views.upload_file, name="upload-file"),
    *router.urls,
]
