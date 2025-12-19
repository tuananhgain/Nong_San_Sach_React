from django.urls import path
from .views import api_index, api_sortSanPhamTheoDm, api_danhmuc, api_search, api_trangsanpham,api_chitietsanpham,api_khuyenmai,api_dangky, api_dangnhap, api_dangxuat, api_quanli_hoadon, api_change_status,api_quanli_khuyenmai, api_them_km,api_xoa_khuyenmai, api_thongke_hoadon,api_open_cart,api_update_quantity,api_remove_from_cart,api_gio_hang

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
    path("them_khuyenmai/", api_them_km, name="api_them_khuyenmai"),
    path("xoa_khuyenmai/", api_xoa_khuyenmai, name="api_xoa_khuyenmai"),
    path("thongke_hoadon/", api_thongke_hoadon, name="api_thongke_hoadon"),
    path("open_cart/", api_open_cart, name="api_open_cart"),
    path("update_quantity/", api_update_quantity, name="api_update_quantity"),
    path("remove_from_cart/", api_remove_from_cart, name="api_remove_from_cart"),
    path("gio_hang/", api_gio_hang, name="api_gio_hang"),
]
