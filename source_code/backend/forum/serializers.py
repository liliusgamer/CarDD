from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import Post, Tag, Comment, Profile, Like

import re

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    display_name = serializers.CharField(required=False, allow_blank=True, max_length=100)

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'display_name')

    def validate_username(self, value):
        # Kiểm tra username chỉ chứa chữ cái, số và dấu gạch dưới
        if not re.match(r'^[a-zA-Z0-9_]+$', value):
            raise serializers.ValidationError("Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới (_)")
        
        # Kiểm tra độ dài
        if len(value) < 3:
            raise serializers.ValidationError("Tên đăng nhập phải có ít nhất 3 ký tự")
        
        if len(value) > 30:
            raise serializers.ValidationError("Tên đăng nhập không được quá 30 ký tự")
        
        return value

    def create(self, validated_data):
        display_name = validated_data.pop('display_name', '')
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        
        # Tạo profile với display_name
        from .models import Profile
        Profile.objects.create(user=user, display_name=display_name)
        
        return user

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'is_staff', 'is_superuser']

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        token['is_staff'] = user.is_staff
        token['is_superuser'] = user.is_superuser
        return token 

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name']

class PostSerializer(serializers.ModelSerializer):
    author_username = serializers.CharField(source='author.username', read_only=True)
    author_display_name = serializers.SerializerMethodField()
    author_avatar_url = serializers.SerializerMethodField()
    like_count = serializers.SerializerMethodField()
    liked_by_user = serializers.SerializerMethodField()
    tags = TagSerializer(many=True, read_only=True)
    tag_ids = serializers.PrimaryKeyRelatedField(queryset=Tag.objects.all(), many=True, write_only=True, required=False)
    author = serializers.PrimaryKeyRelatedField(read_only=True)
    class Meta:
        model = Post
        fields = ['id', 'title', 'content', 'author', 'author_username', 'author_display_name', 'author_avatar_url', 'is_draft', 'tags', 'tag_ids', 'created_at', 'updated_at', 'like_count', 'liked_by_user']

    def get_author_display_name(self, obj):
        profile = getattr(obj.author, 'profile', None)
        if profile and profile.display_name:
            return profile.display_name
        return obj.author.username

    def get_author_avatar_url(self, obj):
        profile = getattr(obj.author, 'profile', None)
        request = self.context.get('request')
        if profile and profile.avatar and hasattr(profile.avatar, 'url'):
            if request:
                return request.build_absolute_uri(profile.avatar.url)
            return profile.avatar.url
        return None
    def get_like_count(self, obj):
        return obj.likes.count()
    def get_liked_by_user(self, obj):
        user = self.context.get('request').user if self.context.get('request') else None
        if user and user.is_authenticated:
            return obj.likes.filter(user=user).exists()
        return False

    def create(self, validated_data):
        tags = validated_data.pop('tag_ids', [])
        post = Post.objects.create(**validated_data)
        post.tags.set(tags)
        return post

    def update(self, instance, validated_data):
        tags = validated_data.pop('tag_ids', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        if tags is not None:
            instance.tags.set(tags)
        return instance 

class CommentSerializer(serializers.ModelSerializer):
    author_username = serializers.CharField(source='author.username', read_only=True)
    author_display_name = serializers.SerializerMethodField()
    author_avatar_url = serializers.SerializerMethodField()
    author = serializers.PrimaryKeyRelatedField(read_only=True)
    parent = serializers.PrimaryKeyRelatedField(queryset=Comment.objects.all(), required=False, allow_null=True)
    replies = serializers.SerializerMethodField()
    class Meta:
        model = Comment
        fields = ['id', 'post', 'author', 'author_username', 'author_display_name', 'author_avatar_url', 'content', 'created_at', 'updated_at', 'parent', 'replies']

    def get_author_display_name(self, obj):
        profile = getattr(obj.author, 'profile', None)
        if profile and profile.display_name:
            return profile.display_name
        return obj.author.username

    def get_author_avatar_url(self, obj):
        profile = getattr(obj.author, 'profile', None)
        request = self.context.get('request')
        if profile and profile.avatar and hasattr(profile.avatar, 'url'):
            if request:
                return request.build_absolute_uri(profile.avatar.url)
            return profile.avatar.url
        return None

    def get_replies(self, obj):
        # Trả về danh sách các reply con 
        replies = obj.replies.all().order_by('created_at')
        return CommentSerializer(replies, many=True).data 

class ProfileSerializer(serializers.ModelSerializer):
    avatar_url = serializers.SerializerMethodField()
    display_name = serializers.CharField(required=False, allow_blank=True)
    
    class Meta:
        model = Profile
        fields = ['avatar_url', 'display_name']

    def get_avatar_url(self, obj):
        request = self.context.get('request')
        if obj.avatar and hasattr(obj.avatar, 'url'):
            if request:
                return request.build_absolute_uri(obj.avatar.url)
            return obj.avatar.url
        return None 

class LikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Like
        fields = ['id', 'post', 'user', 'created_at'] 