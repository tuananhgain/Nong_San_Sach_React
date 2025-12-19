from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import sanpham, dmsanpham
from .serializers import SanPhamSerializer, DanhMucSerializer
from django.shortcuts import get_object_or_404
from django.conf import settings
from datetime import date
from django.utils.dateparse import parse_date
import uuid
from django.db.models import Count
import os
from django.db.models import Max
from django.utils.decorators import method_decorator
from django.utils import timezone
from .models import dmsanpham,sanpham,nhacc,khachhang,loaithetv,capnhatthe,khuyenmai,nhanvien,hinhanhsp,hoadon,tknhanvien,tkkhachhang,chitiethoadon,Cart_SP,Cart
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

    account = tkkhachhang.objects.filter(tentk=username).first()
    admin = tknhanvien.objects.filter(tentk=username).first()

    if account and account.matkhau == password:
        kh = khachhang.objects.filter(makh=account.makh).values("makh", "tenkh").first()

        request.session["IsAuthenticated"] = True
        request.session["UserId"] = kh["makh"]
        request.session["Role"] = "customer"

        request.session.modified = True
        request.session.save()

        return Response({
            "status": "success",
            "message": "Đăng nhập thành công",
            "role": "customer",
            "data": {
                "username": account.tentk,
                "makh": kh["makh"],
                "tenkh": kh["tenkh"]
            }
        })

    if admin and admin.matkhau == password:
        request.session["IsAuthenticated"] = True
        request.session["Role"] = "admin"
        request.session["AdminUser"] = admin.tentk

        request.session.modified = True
        request.session.save()

        return Response({
            "status": "success",
            "message": "Đăng nhập admin thành công",
            "role": "admin",
            "data": {"username": admin.tentk}
        })

    return Response({"status": "error", "message": "Tài khoản không tồn tại hoặc sai mật khẩu"}, status=400)



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
            "ngaybd": km.ngaybd,
            "ngaykt": km.ngaykt,
            "giamgia": km.giamgia,
        }
        for km in khuyenmais
    ]

    return Response({"status": "success", "data": data})

@api_view(['POST'])
def api_them_km(request):
    tenKM = request.data.get('tenKM')
    ngayBatDau = request.data.get('ngayBatDau')
    ngayKetThuc = request.data.get('ngayKetThuc')
    phanTramGiam = request.data.get('phanTramGiam')

    # Validate
    if not tenKM or not ngayBatDau or not ngayKetThuc or not phanTramGiam:
        return Response({"status": "error", "message": "Thiếu thông tin!"}, status=400)

    if int(phanTramGiam) <= 0:
        return Response({"status": "error", "message": "Phần trăm giảm không hợp lệ!"}, status=400)

    # Tạo mã tự động
    last_km = khuyenmai.objects.aggregate(max_id=Max('makm'))["max_id"]
    if last_km:
        last_index = int(last_km[2:])
    else:
        last_index = 0
    new_makm = f"KM{last_index + 1:03d}"

    # Tạo đối tượng
    km = khuyenmai.objects.create(
        makm=new_makm,
        tenkm=tenKM,
        ngaybd=parse_date(ngayBatDau),
        ngaykt=parse_date(ngayKetThuc),
        giamgia=int(phanTramGiam)
    )

    return Response({
        "status": "success",
        "message": "Thêm khuyến mãi thành công!",
        "data": {
            "makm": km.makm,
            "tenkm": km.tenkm,
            "ngaybd": km.ngaybd,
            "ngaykt": km.ngaykt,
            "giamgia": km.giamgia,
        }
    })

@api_view(['POST'])
def api_xoa_khuyenmai(request):
    makm = request.data.get("makm")

    if not makm:
        return Response({"status": "error", "message": "Thiếu mã KM"}, status=400)

    try:
        km = khuyenmai.objects.get(makm=makm)
        km.delete()
        return Response({"status": "success", "message": "Đã xóa"})
    except khuyenmai.DoesNotExist:
        return Response({"status": "error", "message": "Không tìm thấy"}, status=404)

@api_view(['GET'])
def api_thongke_hoadon(request):
    time_filter = request.GET.get('time', '')
    dshd = hoadon.objects.filter(trangthaihd="HOÀN THÀNH").order_by('-mahd')

    current_date = timezone.now().date()

    # --- Lọc theo thời gian ---
    if time_filter:
        if time_filter == "Theo Ngày":
            dshd = dshd.filter(ngaydat__date=current_date)

        elif time_filter == "Theo Tuần":
            start_of_week = current_date - timedelta(days=current_date.weekday())
            end_of_week = start_of_week + timedelta(days=6)
            dshd = dshd.filter(
                ngaydat__date__gte=start_of_week,
                ngaydat__date__lte=end_of_week
            )

        elif time_filter == "Theo Tháng":
            dshd = dshd.filter(
                ngaydat__month=current_date.month,
                ngaydat__year=current_date.year
            )

        elif time_filter == "Theo Năm":
            dshd = dshd.filter(
                ngaydat__year=current_date.year
            )

    # --- Convert dữ liệu về JSON ---
    data = [
        {
            "mahd": hd.mahd,
            "makh": hd.makh.makh if hd.makh else None,
            "tenkh": hd.makh.tenkh if hd.makh else None,
            "ngaydat": hd.ngaydat,
            "tongtien": hd.tongtien,
            "trangthaihd": hd.trangthaihd,
        }
        for hd in dshd
    ]

    return Response({
        "status": "success",
        "count": len(data),
        "data": data
    })

########################################## GIỎ HÀNG###########################################

# ---------------------------
# API: Lấy giỏ hàng
# ---------------------------
@api_view(['GET'])
def api_open_cart(request):

    # Kiểm tra đăng nhập
    #if not request.session.get("IsAuthenticated"):
        #return Response({
            #"status": "error",
            #"message": "Vui lòng đăng nhập để vào giỏ hàng."
        #}, status=401)

    cart_data = request.session.get("cart")
    cart = Cart.from_dict(cart_data) if cart_data else Cart()


    return Response({
        "status": "success",
        "cart": cart.to_dict(),
        "tong_tien": cart.tong_tien,
    })


# ---------------------------
# API: Thêm sản phẩm vào giỏ
# ---------------------------
from django.views.decorators.csrf import csrf_exempt


@api_view(['POST'])
def api_gio_hang(request):

    product_id = request.data.get("productId")
    quantity = int(request.data.get("quantity", 1))

    # Chưa đăng nhập
    #if not request.session.get("IsAuthenticated"):
        #return Response({
            #"status": "error",
            #"message": "Vui lòng đăng nhập trước khi thêm sản phẩm vào giỏ hàng."
        #}, status=401)

    if not product_id or quantity <= 0:
        return Response({"status": "error", "message": "Dữ liệu không hợp lệ"}, status=400)

    sp_instance = get_object_or_404(sanpham, masp=product_id)

    # Kiểm tra tồn kho
    if sp_instance.soluongtk <= 0:
        return Response({
            "status": "error",
            "message": f"Sản phẩm '{sp_instance.tensp}' đang hết hàng."
        }, status=400)

    # Lấy giỏ hàng
    cart_data = request.session.get("cart")
    cart = Cart.from_dict(cart_data) if cart_data else Cart()

    # Thêm sản phẩm
    cart.them_sp(product_id, quantity)

    # Lưu session
    request.session["cart"] = cart.to_dict()
    request.session.modified = True

    return Response({
        "status": "success",
        "message": f"Đã thêm {quantity} sản phẩm '{sp_instance.tensp}' vào giỏ.",
        "cart": cart.to_dict(),
        "tong_tien": cart.tong_tien,
    })



# ---------------------------
# API: Cập nhật số lượng
# ---------------------------
@api_view(['POST'])
def api_update_quantity(request):

    masp = request.data.get("masp")
    delta = int(request.data.get("quantityChange", 0))

    if not masp:
        return Response({"status": "error", "message": "Thiếu mã sản phẩm"}, status=400)

    cart_data = request.session.get("cart")
    cart = Cart.from_dict(cart_data) if cart_data else Cart()

    cart.cap_nhat_sl(masp, delta)

    request.session["cart"] = cart.to_dict()
    request.session.modified = True

    return Response({
        "status": "success",
        "message": "Đã cập nhật số lượng",
        "cart": cart.to_dict(),
        "tong_tien": cart.tong_tien
    })



# ---------------------------
# API: Xóa sản phẩm khỏi giỏ
# ---------------------------
@api_view(['POST'])
def api_remove_from_cart(request):

    masp = request.data.get("product_id")

    if not masp:
        return Response({"status": "error", "message": "Thiếu mã sản phẩm"}, status=400)

    cart_data = request.session.get("cart")
    cart = Cart.from_dict(cart_data) if cart_data else Cart()

    cart.xoa_sp(masp)

    request.session["cart"] = cart.to_dict()
    request.session.modified = True

    return Response({
        "status": "success",
        "message": "Đã xóa sản phẩm khỏi giỏ",
        "cart": cart.to_dict(),
        "tong_tien": cart.tong_tien
    })