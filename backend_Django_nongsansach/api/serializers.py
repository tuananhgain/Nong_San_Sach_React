from rest_framework import serializers
from .models import sanpham, dmsanpham,khuyenmai,chitiethoadon, hoadon, khachhang, nhanvien

class DanhMucSerializer(serializers.ModelSerializer):
    class Meta:
        model = dmsanpham
        fields = ['madm', 'tendm']

class KhuyenMaiSerializer(serializers.ModelSerializer):
    class Meta:
        model = khuyenmai
        fields = ["makm", "giamgia"]

class SanPhamSerializer(serializers.ModelSerializer):
    gia_khuyenmai = serializers.SerializerMethodField()
    makm = KhuyenMaiSerializer(allow_null=True, read_only=True)
    madm = DanhMucSerializer(read_only=True)

    class Meta:
        model = sanpham
        fields = "__all__"

    def get_gia_khuyenmai(self, obj):
        if obj.makm:
            return obj.gia1dv * (1 - obj.makm.giamgia / 100)
        return None
