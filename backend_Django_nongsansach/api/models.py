from django.db import models


class dmsanpham(models.Model):
    madm= models.CharField(max_length=10, primary_key=True)
    tendm= models.CharField(max_length=50)

    def __str__(self):
        return f"{self.madm}"

class nhacc(models.Model):
    mancc= models.CharField(max_length=10, primary_key=True)
    tencc= models.CharField(max_length=50)
    diachi=models.CharField(max_length=50, null=True)

    def __str__(self):
        return f"{self.mancc}"

class khuyenmai(models.Model):
    makm= models.CharField(max_length=10, primary_key=True)
    tenkm= models.CharField(max_length=50)
    ngaybd= models.DateField()
    ngaykt= models.DateField()
    giamgia= models.FloatField()

    def __str__(self):
        return f"{self.makm} {self.giamgia}"


class sanpham(models.Model):
    masp= models.CharField(max_length=10, primary_key=True)
    tensp= models.CharField(max_length=50)
    donvitinh= models.CharField(max_length=20)
    gia1dv= models.IntegerField()
    soluongtk= models.IntegerField()
    xuatxu= models.CharField(max_length=30)
    madm= models.ForeignKey(dmsanpham, on_delete=models.CASCADE)
    mancc= models.ForeignKey(nhacc, on_delete=models.CASCADE)
    makm = models.ForeignKey(khuyenmai, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return f"{self.masp} "


class khachhang(models.Model):
    makh= models.CharField(max_length=10, primary_key=True)
    tenkh= models.CharField(max_length=50)
    sdt=models.CharField(max_length=10)
    diachi=models.CharField(max_length=50)
    capdotv= models.CharField(max_length=20)

    def __str__(self):
        return f"{self.makh}"


class loaithetv(models.Model):
    maloaithe= models.CharField(max_length=10, primary_key=True)
    tenthe= models.CharField(max_length=30)
    uudai= models.FloatField()
    dieukien= models.IntegerField()

    def __str__(self):
        return f"{self.maloaithe}"


class capnhatthe(models.Model):
    makh= models.ForeignKey(khachhang, on_delete=models.CASCADE)
    maloaithe= models.ForeignKey(loaithetv, on_delete=models.CASCADE)
    ngaycap= models.DateField()

    class Meta:
        unique_together = ('makh', 'maloaithe')

    def __str__(self):
        return f"{self.makh} {self.maloaithe} {self.ngaycap}"


class nhanvien(models.Model):
    manv= models.CharField(max_length=10, primary_key=True)
    tennv= models.CharField(max_length=50)
    diachi=models.CharField(max_length=50)
    gioitinh=models.CharField(max_length=5)
    cccd=models.CharField(max_length=20)
    sdt=models.CharField(max_length=10)
    ngaysinh=models.DateField()
    chucvu=models.CharField(max_length=20)

    def __str__(self):
        return f"{self.manv}"


class hinhanhsp(models.Model):
    mahinh= models.CharField(max_length=10, primary_key=True)
    masp= models.ForeignKey(sanpham, on_delete=models.CASCADE)
    tenhinh=models.CharField(max_length=50)

    def __str__(self):
        return f"{self.mahinh} {self.masp} {self.tenhinh}"


class tknhanvien(models.Model):
    tentk= models.CharField(max_length=30, primary_key=True)
    manv= models.ForeignKey(nhanvien, on_delete=models.CASCADE)
    matkhau= models.CharField(max_length=20)
    chucvu=models.CharField(max_length=30)

    def __str__(self):
        return f"{self.tentk} {self.manv} {self.matkhau} {self.chucvu}"


class tkkhachhang(models.Model):
    tentk= models.CharField(max_length=30, primary_key=True)
    makh= models.ForeignKey(khachhang, on_delete=models.CASCADE)
    matkhau= models.CharField(max_length=20) 

    def __str__(self):
        return f"{self.tentk} {self.makh} {self.matkhau}"   

class hoadon(models.Model):
    mahd= models.CharField(max_length=10, primary_key=True)
    makh= models.ForeignKey(khachhang, on_delete=models.SET_NULL, null=True, blank=True)
    manv= models.ForeignKey(nhanvien, on_delete=models.CASCADE)
    makm= models.ForeignKey(khuyenmai, on_delete=models.CASCADE)
    ngaydat= models.DateField()
    trangthaihd=models.CharField(max_length=30)
    phuongthucgh=models.CharField(max_length=30)
    phuongthucthtoan=models.CharField(max_length=20,default='Cash',
        choices = [
            ('Cash','Tiền mặt'),
            ('Bank','Chuyển khoản')
        ]
    )
    ngaygiao=models.DateField()
    tongtien=models.IntegerField()

    def __str__(self):
        return f"{self.mahd} {self.manv} {self.makm} "


class chitiethoadon(models.Model):
    macthd= models.CharField(max_length=10, primary_key=True)
    mahd= models.ForeignKey(hoadon, on_delete=models.CASCADE)
    masp= models.ForeignKey(sanpham, on_delete=models.CASCADE)
    soluongban= models.FloatField()
    giaban= models.IntegerField()

    def __str__(self):
        return f"{self.macthd} {self.mahd} {self.masp} {self.soluongban} {self.giaban}"

###########################CART - CART SP###########################

# ------------------------------------------------
# Lớp Cart_SP: đại diện cho 1 sản phẩm trong giỏ
# ------------------------------------------------


########################### CART - CART SP ###########################


class Cart_SP:
    """Đại diện cho 1 sản phẩm trong giỏ hàng"""

    def __init__(self, masp=None, soluong=1):
        self.masanpham = None
        self.tensanpham = None
        self.giatien = 0
        self.hinhanh = None
        self.dvt = None
        self.soluong = soluong

        if masp:
            try:
                sp = sanpham.objects.get(masp=masp)

                self.masanpham = sp.masp
                self.tensanpham = sp.tensp
                self.dvt = sp.donvitinh

                # ✅ Giá sau khuyến mãi
                if sp.makm:
                    self.giatien = int(sp.gia1dv * (1 - sp.makm.giamgia / 100))
                else:
                    self.giatien = sp.gia1dv

                # ✅ Lấy hình ảnh
                hinh = hinhanhsp.objects.filter(masp=sp).first()
                self.hinhanh = hinh.tenhinh if hinh else "HINH1.jfif"

            except sanpham.DoesNotExist:
                pass

    @property
    def tong_tien(self):
        return self.giatien * self.soluong

    # ✅ Serialize cho API / session
    def to_dict(self):
        return {
            "masanpham": self.masanpham,
            "tensanpham": self.tensanpham,
            "giatien": self.giatien,
            "soluong": self.soluong,
            "tong_tien": self.tong_tien,
            "hinhanh": self.hinhanh,
            "dvt": self.dvt
        }


class Cart:
    """Giỏ hàng"""

    def __init__(self):
        self.listSP = []

    # ---------------- thêm sản phẩm ----------------
    def them_sp(self, masp, soluong=1):
        sp = next((i for i in self.listSP if i.masanpham == masp), None)
        if sp:
            sp.soluong += soluong
        else:
            self.listSP.append(Cart_SP(masp, soluong))

    # ---------------- cập nhật số lượng ----------------
    def cap_nhat_sl(self, masp, delta):
        sp = next((i for i in self.listSP if i.masanpham == masp), None)
        if sp:
            sp.soluong += delta
            if sp.soluong <= 0:
                self.listSP.remove(sp)

    # ---------------- xóa sản phẩm ----------------
    def xoa_sp(self, masp):
        self.listSP = [sp for sp in self.listSP if sp.masanpham != masp]

    # ---------------- tổng tiền ----------------
    @property
    def tong_tien(self):
        return sum(sp.tong_tien for sp in self.listSP)

    # ---------------- lưu session ----------------
    def to_dict(self):
        return {
            "listSP": [sp.to_dict() for sp in self.listSP],
            "tong_tien": self.tong_tien
        }

    # ---------------- khôi phục từ session ----------------
    @classmethod
    def from_dict(cls, data):
        cart = cls()
        for item in data.get("listSP", []):
            sp = Cart_SP()
            sp.masanpham = item.get("masanpham")
            sp.tensanpham = item.get("tensanpham")
            sp.giatien = item.get("giatien", 0)
            sp.soluong = item.get("soluong", 1)
            sp.hinhanh = item.get("hinhanh")
            sp.dvt = item.get("dvt")
            cart.listSP.append(sp)
        return cart
