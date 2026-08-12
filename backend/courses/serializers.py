from rest_framework import serializers

from .models import Course, CourseChapter, CourseItem


def epoch_ms(dt):
    if not dt:
        return None
    return int(dt.timestamp() * 1000)


class CourseItemSerializer(serializers.ModelSerializer):
    fileData = serializers.CharField(source="file_url", required=False, allow_blank=True)
    fileMeta = serializers.JSONField(source="file_meta", required=False, allow_null=True)
    quizQuestions = serializers.JSONField(source="quiz_questions", required=False, allow_null=True)

    class Meta:
        model = CourseItem
        fields = [
            "id",
            "title",
            "type",
            "description",
            "url",
            "startDate",
            "endDate",
            "duration",
            "fileData",
            "fileMeta",
            "quizQuestions",
        ]
        extra_kwargs = {
            "startDate": {"source": "start_date", "required": False, "allow_null": True},
            "endDate": {"source": "end_date", "required": False, "allow_null": True},
            "description": {"required": False, "allow_blank": True},
            "url": {"required": False, "allow_blank": True},
            "duration": {"required": False, "allow_blank": True},
        }


class CourseChapterSerializer(serializers.ModelSerializer):
    items = CourseItemSerializer(many=True, required=False)

    class Meta:
        model = CourseChapter
        fields = ["id", "title", "items"]
        extra_kwargs = {
            "title": {"required": False, "allow_blank": True},
        }


class PricingSerializer(serializers.Serializer):
    planType = serializers.ChoiceField(choices=["FREE", "ONE_TIME"], required=False, default="ONE_TIME")
    mrp = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    price = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    passFees = serializers.BooleanField(required=False, default=True)


class CourseSerializer(serializers.ModelSerializer):
    chapters = CourseChapterSerializer(many=True, required=False)
    pricing = PricingSerializer(required=False)
    cover = serializers.CharField(required=False, allow_blank=True)
    createdAt = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = [
            "id",
            "title",
            "description",
            "tagline",
            "tags",
            "instructor",
            "language",
            "cover",
            "pricing",
            "chapters",
            "createdAt",
        ]
        extra_kwargs = {
            "description": {"required": False, "allow_blank": True},
            "tagline": {"required": False, "allow_blank": True},
            "tags": {"required": False, "allow_blank": True},
            "instructor": {"required": False, "allow_blank": True},
            "language": {"required": False, "allow_blank": True},
        }

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data["pricing"] = {
            "planType": instance.plan_type,
            "mrp": instance.mrp,
            "price": instance.price,
            "passFees": instance.pass_fees,
        }
        return data

    def get_createdAt(self, obj):
        return epoch_ms(obj.created_at)

    def _apply_pricing(self, instance, pricing):
        instance.plan_type = pricing.get("planType", instance.plan_type)
        instance.mrp = pricing.get("mrp") or instance.mrp
        instance.price = pricing.get("price") or instance.price
        instance.pass_fees = pricing.get("passFees", instance.pass_fees)
        return instance

    def create(self, validated_data):
        chapters_data = validated_data.pop("chapters", []) or []
        pricing = validated_data.pop("pricing", None)
        course = Course.objects.create(**validated_data)
        if pricing:
            course = self._apply_pricing(course, pricing)
            course.save()
        self._create_chapters(course, chapters_data)
        return course

    def update(self, instance, validated_data):
        chapters_data = validated_data.pop("chapters", None)
        pricing = validated_data.pop("pricing", None)
        if pricing:
            instance = self._apply_pricing(instance, pricing)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        if chapters_data is not None:
            instance.chapters.all().delete()
            self._create_chapters(instance, chapters_data)
        return instance

    @staticmethod
    def _item_kwargs(item_data):
        mapping = {
            "fileData": "file_url",
            "fileMeta": "file_meta",
            "startDate": "start_date",
            "endDate": "end_date",
            "quizQuestions": "quiz_questions",
        }
        return {mapping.get(k, k): v for k, v in item_data.items()}

    @staticmethod
    def _create_chapters(course, chapters_data):
        for position, chapter_data in enumerate(chapters_data):
            items_data = chapter_data.pop("items", None) or []
            chapter = CourseChapter.objects.create(
                course=course,
                title=chapter_data.get("title", ""),
                position=position,
            )
            for item_position, item_data in enumerate(items_data):
                kwargs = CourseSerializer._item_kwargs(item_data)
                CourseItem.objects.create(chapter=chapter, position=item_position, **kwargs)
