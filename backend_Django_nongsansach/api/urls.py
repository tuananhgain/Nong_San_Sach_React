from django.urls import path
from .views import api_index, api_sortSanPhamTheoDm, api_danhmuc, api_search, api_trangsanpham,api_chitietsanpham,api_khuyenmai,api_dangky, api_dangnhap, api_dangxuat, api_quanli_hoadon, api_change_status,api_quanli_khuyenmai

urlpatterns = [
    path("", api_index, name="api_index"),
    path("danhmuc/", api_danhmuc, name="api_danhmuc"),
    path("danhmuc/<str:madm>/", api_sortSanPhamTheoDm, name="api_sortSanPhamTheoDm"),
    path("search/", api_search, name="api_search"),
    path("trangsanpham/", api_trangsanpham, name="api_trangsanpham"),
    path("sanpham/<str:masp>/", api_chitietsanpham, name="api_chitietsanpham"),
    path("khuyenmai/", api_khuyenmai, name="api_khuyenmai"),
    path("dangky/", api_dangky, name="api_dangky"),
    path("dangnhap/", api_dangnhap, name="api_dangnhap"),
    path("dangxuat/", api_dangxuat, name="api_dangxuat"),
    path("hoadon/", api_quanli_hoadon, name="api_quanli_hoadon"),
    path("change_status/", api_change_status, name="api_change_status"),
    path("quanli_khuyenmai/", api_quanli_khuyenmai, name="api_quanli_khuyenmai"),
]
