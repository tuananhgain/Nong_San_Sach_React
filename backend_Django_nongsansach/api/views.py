from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import sanpham, dmsanpham
from .serializers import SanPhamSerializer, DanhMucSerializer
from django.shortcuts import get_object_or_404
from django.conf import settings
from datetime import date
import uuid
from django.db.models import Count
import os
from django.db.models import Max
from django.utils import timezone
from .models import dmsanpham,sanpham,nhacc,khachhang,loaithetv,capnhatthe,khuyenmai,nhanvien,hinhanhsp,hoadon,tknhanvien,tkkhachhang,chitiethoadon
from .serializers import SanPhamSerializer, DanhMucSerializer

@api_view(["GET"])
def api_index(request):
    sanphams = sanpham.objects.all().order_by('masp')
    dsdm = dmsanpham.objects.all()

    ser_sp = SanPhamSerializer(sanphams, many=True)
    ser_dm = DanhMucSerializer(dsdm, many=True)

    return Response({
        "status": "success",
        "data": {
            "sanphams": ser_sp.data,
            "dsdm": ser_dm.data
        }
    }, status=status.HTTP_200_OK)

@api_view(["GET"])
def api_danhmuc(request):
    dsdm = dmsanpham.objects.all().order_by('madm')
    data = DanhMucSerializer(dsdm, many=True).data
    return Response({"dsdm": data})


@api_view(["GET"])
def api_sortSanPhamTheoDm(request, madm):
    sanphams = sanpham.objects.filter(madm=madm).order_by('masp')
    dsdm = dmsanpham.objects.all()

    sp_data = SanPhamSerializer(sanphams, many=True).data
    dm_data = DanhMucSerializer(dsdm, many=True).data

    return Response({
        "sanphams": sp_data,
        "dsdm": dm_data
    })

@api_view(["GET"])
def api_search(request):
    search_term = request.GET.get("q", "").strip()

    dssp = sanpham.objects.all().order_by("masp")

    if search_term:
        dssp = dssp.filter(tensp__icontains=search_term)

    sp_data = SanPhamSerializer(dssp, many=True).data

    return Response({
        "search_term": search_term,
        "sanphams": sp_data
    })

@api_view(["GET"])
def api_trangsanpham(request):
    sort=request.GET.get("sort")
    dsdm = dmsanpham.objects.all()
    sanphams = sanpham.objects.all().order_by('masp')

    if sort:
        sanphams = sanphams.order_by(sort)

    ser_sp = SanPhamSerializer(sanphams, many=True)
    ser_dm = DanhMucSerializer(dsdm, many=True)

    return Response({
        "data": {
            "sanphams": ser_sp.data,
            "dsdm": ser_dm.data
        }
    }, status=status.HTTP_200_OK)

@api_view(["GET"])
def api_chitietsanpham(request, masp):
    sp = get_object_or_404(sanpham, masp=masp)
    dsdm = dmsanpham.objects.all()

    ser_sp = SanPhamSerializer(sp)
    ser_dm = DanhMucSerializer(dsdm, many=True)

    folder_name = f"HinhAnh/Hình {sp.masp}"

    # React sẽ tự load ảnh từ public/
    main_image = f"{folder_name}/HINH1.jfif"

    # danh sách hình phụ (không check tồn tại nữa)
    thumbnails = [
        f"{folder_name}/HINH{i}.jfif" for i in range(1, 5)
    ]

    return Response({
        "data": {
            "sanpham": ser_sp.data,
            "dsdm": ser_dm.data,
            "main_image": main_image,
            "thumbnails": thumbnails
        }
    }, status=status.HTTP_200_OK)

@api_view(["GET"])
def api_khuyenmai(request):
    sanphams = sanpham.objects.filter(makm__isnull=False)
    ser_sp = SanPhamSerializer(sanphams, many=True)

    dsdm = dmsanpham.objects.all()
    ser_dm = DanhMucSerializer(dsdm, many=True)

    return Response({
        "sanphams": ser_sp.data,
        "dsdm": ser_dm.data
    }, status=status.HTTP_200_OK)

################################Dang Ky - Dang Nhap - Dang Xuat####################################
@api_view(['POST'])
def api_dangky(request):
    data = request.data

    try:
        # 1️⃣ Tạo mã khách hàng tự động
        last_customer = khachhang.objects.aggregate(Max("makh"))["makh__max"]
        if last_customer:
            last_num = int(last_customer[2:])
            new_makh = f"KH{last_num+1:03d}"
        else:
            new_makh = "KH001"

        # 2️⃣ Tạo khách hàng
        kh = khachhang.objects.create(
            makh=new_makh,
            tenkh=data['tenkh'],
            sdt=data['sdt'],
            diachi=data['diachi'],
            capdotv="Đồng"
        )

        # 3️⃣ Lấy loại thẻ mặc định
        loai = loaithetv.objects.get(maloaithe="T01")

        # 4️⃣ Cập nhật thẻ
        capnhatthe.objects.create(
            makh=kh,
            maloaithe=loai,
            ngaycap=date.today()
        )

        # 5️⃣ Tạo tài khoản đăng nhập
        tkkhachhang.objects.create(
            tentk=data['tentk'],
            makh=kh,
            matkhau=data['matkhau']
        )

        return Response({"status": "success", "message": "Đăng ký thành công"})

    except loaithetv.DoesNotExist:
        return Response({"status": "error", "message": "Thiếu loại thẻ T01"}, status=400)

    except Exception as e:
        import traceback
        traceback.print_exc()
        return Response({"status": "error", "message": str(e)}, status=500)

@api_view(['POST'])
def api_dangnhap(request):
    username = request.data.get("username")
    password = request.data.get("password")

    if not username or not password:
        return Response({"status": "error", "message": "Thiếu username hoặc password"}, status=400)

    # Check tài khoản khách hàng
    account = tkkhachhang.objects.filter(tentk=username).first()
    admin = tknhanvien.objects.filter(tentk=username).first()

    # === Khách hàng ===
    if account:
        if account.matkhau == password:
            kh = khachhang.objects.filter(makh=account.makh).values("makh", "tenkh").first()

            # Tạo token login đơn giản
            token = str(uuid.uuid4())

            return Response({
                "status": "success",
                "message": "Đăng nhập thành công",
                "role": "customer",
                "token": token,
                "data": {
                    "username": account.tentk,
                    "makh": kh["makh"] if kh else None,
                    "tenkh": kh["tenkh"] if kh else "",
                }
            })
        else:
            return Response({"status": "error", "message": "Mật khẩu không đúng"}, status=400)

    # === Admin ===
    if admin:
        if admin.matkhau == password:
            token = str(uuid.uuid4())
            return Response({
                "status": "success",
                "message": "Đăng nhập admin thành công",
                "role": "admin",
                "token": token,
                "data": {
                    "username": admin.tentk
                }
            })
        else:
            return Response({"status": "error", "message": "Sai mật khẩu admin"}, status=400)

    # Không tìm thấy tài khoản
    return Response({"status": "error", "message": "Tài khoản không tồn tại"}, status=404)

@api_view(['POST'])
def api_dangxuat(request):
    return Response({
        "status": "success",
        "message": "Đăng xuất thành công"
    })

############################### ADMIN #############################################

@api_view(['GET'])
def api_quanli_hoadon(request):
    status = request.GET.get('status', '')
    payment = request.GET.get('payment', '')

    hoadons = hoadon.objects.all()

    # Lọc theo trạng thái
    if status:
        hoadons = hoadons.filter(trangthaihd__iexact=status)

    # Lọc theo phương thức thanh toán
    if payment:
        hoadons = hoadons.filter(phuongthucthanhtoan__iexact=payment)

    # Sắp xếp giảm dần theo mã hóa đơn
    hoadons = hoadons.order_by('-mahd')

    # Chuyển sang JSON trả về
    data = [
        {
            "mahd": h.mahd,
            "makh": h.makh.makh if h.makh else None,
            "manv": h.manv.manv,
            "makm": h.makm.makm if h.makm else None,
            "ngaydat": h.ngaydat,
            "trangthaihd": h.trangthaihd,
            "phuongthucgh": h.phuongthucgh,
            "phuongthucthtoan": h.phuongthucthtoan,
            "ngaygiao": h.ngaygiao,
            "tongtien": h.tongtien,
        }
        for h in hoadons
    ]

    return Response({"status": "success", "data": data})

@api_view(['POST'])
def api_change_status(request):
    try:
        mahd = request.data.get('mahd')
        change_status = request.data.get('changeStatus')

        if not mahd or not change_status:
            return Response({"error": "Thiếu dữ liệu"}, status=400)

        # Lấy hóa đơn
        hd = get_object_or_404(hoadon, mahd=mahd)

        # Nếu chuyển sang trạng thái ĐANG GIAO → gán nhân viên ít đơn nhất
        if change_status == "ĐANG GIAO":
            nhanviens = (
                nhanvien.objects
                .annotate(so_don_da_giao=Count('hoadon'))
                .order_by('so_don_da_giao')
            )

            nv_giao = nhanviens.first()
            if nv_giao:
                hd.manv = nv_giao

        # Nếu hoàn thành → cập nhật ngày giao
        elif change_status == "HOÀN THÀNH":
            hd.ngaygiao = timezone.now()

        # Cập nhật trạng thái
        hd.trangthaihd = change_status
        hd.save()

        return Response({
            "status": "success",
            "message": "Cập nhật trạng thái thành công!",
            "data": {
                "mahd": hd.mahd,
                "new_status": hd.trangthaihd,
                "manv": hd.manv.manv if hd.manv else None
            }
        })

    except Exception as e:
        return Response({"error": str(e)}, status=500)

@api_view(['GET'])
def api_quanli_khuyenmai(request):
    khuyenmais = khuyenmai.objects.all().order_by('makm')

    data = [
        {
            "makm": km.makm,
            "tenkm": km.tenkm,
            "ngaybatdau": km.ngaybatdau,
            "ngayketthuc": km.ngayketthuc,
            "giamgia": km.giamgia,
        }
        for km in khuyenmais
    ]

    return Response({"status": "success", "data": data})