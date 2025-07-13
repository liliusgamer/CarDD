from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, viewsets, permissions
from .serializers import RegisterSerializer, UserSerializer
from django.contrib.auth.models import User
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import MyTokenObtainPairSerializer
from .models import Post
from .serializers import PostSerializer
from rest_framework.permissions import IsAuthenticated
from .models import Tag, Comment, Profile, Like
from .serializers import TagSerializer, CommentSerializer, ProfileSerializer, LikeSerializer
from rest_framework import mixins
from django.db import models
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.decorators import action

# Create your views here.

class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({"message": "Đăng ký thành công!"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

class IsAdminUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_staff

class UserAdminViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]

class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all().order_by('-created_at')
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    def get_queryset(self):
        queryset = super().get_queryset()
        author = self.request.query_params.get('author')
        is_draft = self.request.query_params.get('draft')
        tag_id = self.request.query_params.get('tag_id')
        q = self.request.query_params.get('q')
        if author:
            queryset = queryset.filter(author__username=author)
        if is_draft is not None:
            queryset = queryset.filter(is_draft=(is_draft.lower() == 'true'))
        if tag_id:
            queryset = queryset.filter(tags__id=tag_id)
        if q:
            queryset = queryset.filter(models.Q(title__icontains=q) | models.Q(content__icontains=q))
        # Nếu không phải admin, chỉ cho xem bài nháp của chính mình (không dùng union để tránh lỗi DB)
        if not self.request.user.is_staff:
            queryset = queryset.filter(
                models.Q(is_draft=False) | models.Q(is_draft=True, author=self.request.user)
            )
        return queryset

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    def update(self, request, *args, **kwargs):
        post = self.get_object()
        if not (request.user == post.author or request.user.is_staff):
            return Response({'detail': 'Bạn không có quyền chỉnh sửa bài viết này.'}, status=status.HTTP_403_FORBIDDEN)
        return super().update(request, *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        post = self.get_object()
        if not (request.user == post.author or request.user.is_staff):
            return Response({'detail': 'Bạn không có quyền chỉnh sửa bài viết này.'}, status=status.HTTP_403_FORBIDDEN)
        return super().partial_update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        post = self.get_object()
        if not (request.user == post.author or request.user.is_staff):
            return Response({'detail': 'Bạn không có quyền xóa bài viết này.'}, status=status.HTTP_403_FORBIDDEN)
        return super().destroy(request, *args, **kwargs)

    def retrieve(self, request, *args, **kwargs):
        post = self.get_object()
        # Nếu là bài nháp, chỉ tác giả hoặc admin mới xem được
        if post.is_draft and not (request.user == post.author or request.user.is_staff):
            return Response({'detail': 'Bạn không có quyền xem bài viết này.'}, status=status.HTTP_403_FORBIDDEN)
        return super().retrieve(request, *args, **kwargs)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def like(self, request, pk=None):
        post = self.get_object()
        like, created = Like.objects.get_or_create(post=post, user=request.user)
        return Response({'liked': True, 'like_id': like.id})

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def unlike(self, request, pk=None):
        post = self.get_object()
        Like.objects.filter(post=post, user=request.user).delete()
        return Response({'liked': False})

    @action(detail=True, methods=['get'], permission_classes=[IsAuthenticated])
    def like_status(self, request, pk=None):
        post = self.get_object()
        liked = Like.objects.filter(post=post, user=request.user).exists()
        return Response({'liked': liked})

class MeView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        user = request.user
        return Response({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'is_staff': user.is_staff,
            'is_superuser': user.is_superuser,
        })

class MyProfileView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get(self, request):
        profile, _ = Profile.objects.get_or_create(user=request.user)
        serializer = ProfileSerializer(profile, context={'request': request})
        return Response(serializer.data)

    def put(self, request):
        profile, _ = Profile.objects.get_or_create(user=request.user)
        
        # Cập nhật thông tin user nếu có
        if 'username' in request.data:
            new_username = request.data['username'].strip()
            if new_username and new_username != request.user.username:
                # Kiểm tra username đã tồn tại chưa
                if User.objects.filter(username=new_username).exclude(id=request.user.id).exists():
                    return Response({'username': ['Username này đã được sử dụng.']}, status=400)
                request.user.username = new_username
                request.user.save()
        
        # Cập nhật display_name nếu có
        if 'display_name' in request.data:
            profile.display_name = request.data['display_name'].strip()
            profile.save()
        
        # Cập nhật avatar nếu có
        if 'avatar' in request.FILES:
            profile.avatar = request.FILES['avatar']
            profile.save()
        
        return Response(ProfileSerializer(profile, context={'request': request}).data)

class TagViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [IsAuthenticated]

class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all().order_by('created_at')
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    def get_queryset(self):
        queryset = super().get_queryset()
        post_id = self.request.query_params.get('post')
        if post_id:
            queryset = queryset.filter(post_id=post_id)
        return queryset

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    def update(self, request, *args, **kwargs):
        comment = self.get_object()
        if not (request.user == comment.author or request.user.is_staff):
            return Response({'detail': 'Bạn không có quyền chỉnh sửa bình luận này.'}, status=status.HTTP_403_FORBIDDEN)
        return super().update(request, *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        comment = self.get_object()
        if not (request.user == comment.author or request.user.is_staff):
            return Response({'detail': 'Bạn không có quyền chỉnh sửa bình luận này.'}, status=status.HTTP_403_FORBIDDEN)
        return super().partial_update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        comment = self.get_object()
        if not (request.user == comment.author or request.user.is_staff):
            return Response({'detail': 'Bạn không có quyền xóa bình luận này.'}, status=status.HTTP_403_FORBIDDEN)
        return super().destroy(request, *args, **kwargs)
