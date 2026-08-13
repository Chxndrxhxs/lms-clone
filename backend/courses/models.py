from django.db import models


class Course(models.Model):
    class PlanType(models.TextChoices):
        FREE = "FREE", "Free"
        ONE_TIME = "ONE_TIME", "One-time"

    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, default="")
    tagline = models.CharField(max_length=500, blank=True, default="")
    tags = models.CharField(max_length=500, blank=True, default="")
    instructor = models.CharField(max_length=255, blank=True, default="")
    language = models.CharField(max_length=100, blank=True, default="")
    cover = models.CharField(max_length=1000, blank=True, default="")

    plan_type = models.CharField(max_length=20, choices=PlanType.choices, default=PlanType.ONE_TIME)
    mrp = models.CharField(max_length=50, blank=True, default="")
    price = models.CharField(max_length=50, blank=True, default="")
    pass_fees = models.BooleanField(default=True)

    category = models.CharField(max_length=500, blank=True, default="")
    featured_priority = models.PositiveIntegerField(default=0)
    tax_rate = models.CharField(max_length=10, blank=True, default="18")
    course_url = models.CharField(max_length=500, blank=True, default="")
    canonical_url = models.CharField(max_length=500, blank=True, default="")
    seo_title = models.CharField(max_length=500, blank=True, default="")
    seo_description = models.TextField(blank=True, default="")

    show_validity = models.BooleanField(default=True)
    access_channels = models.JSONField(default=list, blank=True)
    offline_usage = models.BooleanField(default=True)
    show_curriculum_info = models.BooleanField(default=True)
    allow_bookmarks = models.BooleanField(default=True)

    welcome_email_enabled = models.BooleanField(default=False)
    welcome_email_subject = models.CharField(max_length=500, blank=True, default="")
    welcome_email_content = models.TextField(blank=True, default="")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.title


class CourseChapter(models.Model):
    course = models.ForeignKey(Course, related_name="chapters", on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    position = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["position", "id"]

    def __str__(self):
        return self.title


class CourseItem(models.Model):
    class ItemType(models.TextChoices):
        PDF = "pdf", "PDF"
        VIDEO = "video", "Video"
        AUDIO = "audio", "Audio"
        SCORM = "scorm", "SCORM"
        FILE = "file", "File"
        HEADING = "heading", "Heading"
        TEXT = "text", "Text"
        LINK = "link", "Link"
        QUIZ = "quiz", "Quiz"
        LIVETEST = "livetest", "Live test"
        LIVECLASS = "liveclass", "Live class"
        ASSIGNMENT = "assignment", "Assignment"
        CODING = "coding", "Coding test"
        FORM = "form", "Form"

    chapter = models.ForeignKey(CourseChapter, related_name="items", on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    type = models.CharField(max_length=20, choices=ItemType.choices)
    description = models.TextField(blank=True, default="")
    url = models.URLField(blank=True, default="")
    start_date = models.DateTimeField(blank=True, null=True)
    end_date = models.DateTimeField(blank=True, null=True)
    duration = models.CharField(max_length=50, blank=True, default="")
    file_url = models.CharField(max_length=1000, blank=True, default="")
    file_meta = models.JSONField(null=True, blank=True)
    quiz_questions = models.JSONField(null=True, blank=True)
    position = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["position", "id"]

    def __str__(self):
        return self.title
