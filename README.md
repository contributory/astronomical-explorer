# 🌌 Cosmic Explorer - Ứng Dụng Khám Phá Thiên Văn Học & Vũ Trụ (Streamlit Application)

![Python](https://img.shields.io/badge/Python-3.12-blue.svg)
![Streamlit](https://img.shields.io/badge/Streamlit-1.30+-red.svg)
![License](https://img.shields.io/badge/License-MIT-green.svg)

**Cosmic Explorer** là một ứng dụng web đa chức năng được phát triển bằng **Streamlit** và **Python**, cho phép người dùng khám phá vũ trụ và thiên văn học thông qua các nguồn dữ liệu API công khai, cập nhật trực tiếp theo thời gian thực (up-to-date) và cào thông tin tin tức thiên văn mới nhất.

---

## ✨ Các Tính Năng Nổi Bật

1. **🌌 Ảnh Thiên Văn Trong Ngày (NASA APOD):**
   - Xem ảnh và video thiên văn được NASA cập nhật mỗi ngày kèm lời giải thích khoa học.
   - Hỗ trợ chọn ngày cụ thể hoặc xem ảnh ngẫu nhiên từ kho dữ liệu NASA từ năm 1995.
   - Cung cấp đường dẫn tải ảnh chất lượng cao (HD).

2. **🛸 Theo Dõi Trạm Vũ Trụ Quốc Tế ISS (Real-time ISS Tracker):**
   - Bản đồ tương tác trực tuyến (Folium Dark Theme) hiển thị vị trí thời gian thực của trạm ISS.
   - Hiển thị kinh độ, vĩ độ, độ cao quỹ đạo (~400km) và vận tốc di chuyển (~28,000 km/h).
   - Thống kê danh sách các phi hành gia hiện đang làm việc ngoài không gian.

3. **☄️ Giám Sát Tiểu Hành Tinh Gần Trái Đất (NASA NeoWS Asteroid Tracker):**
   - Theo dõi các vật thể đi qua gần Trái Đất (Near Earth Objects).
   - Cảnh báo các tiểu hành tinh có khả năng gây nguy hiểm (Potentially Hazardous Asteroids).
   - Biểu đồ Plotly 3 chiều tương tác phân tích tương quan đường kính, vận tốc và khoảng cách.

4. **🔴 Xe Thám Hiểm Sao Hỏa (Mars Rovers Gallery):**
   - Khám phá hình ảnh trực tiếp từ hai robot **Perseverance** và **Curiosity** truyền về từ bề mặt Sao Hỏa.
   - Tùy chỉnh số lượng ảnh hiển thị và thông tin Sol (ngày sao Hỏa).

5. **🪐 Mô Phỏng Hệ Mặt Trời 3D (3D Solar System Explorer):**
   - Biểu đồ 3D chuyển động quỹ đạo tương tác của các hành tinh trong Hệ Mặt Trời theo thời gian.
   - Tính toán và liệt kê tọa độ tương đối (đơn vị AU) sử dụng thư viện `astropy`.

6. **📰 Tin Tức & Cào Dữ Liệu Vũ Trụ (Space News & Scraping):**
   - Tự động cào dữ liệu và tổng hợp bài viết mới nhất từ **Spaceflight News API (SNAPI v4)**.
   - Đọc dòng tin RSS tự động từ các trang báo uy tín: *Space.com, NASA News, SciTechDaily*.
   - Hỗ trợ tìm kiếm bài viết theo từ khóa.

7. **🌐 Hỗ Trợ Đa Ngôn Ngữ (Multilingual Support):**
   - Chuyển đổi linh hoạt giữa **Tiếng Việt** và **English** trực tiếp trên thanh Sidebar.

---

## 🛠️ Cài Đặt & Hướng Dẫn Sử Dụng

### 1. Yêu cầu hệ thống
- Python >= 3.10

### 2. Cài đặt thư viện phụ thuộc
```bash
pip install -r requirements.txt
```

### 3. Chạy ứng dụng Streamlit
```bash
streamlit run app.py
```

Ứng dụng sẽ tự động khởi chạy tại trình duyệt địa chỉ: `http://localhost:8501`.

---

## 🧪 Chạy Kiểm Thử (Unit Tests)
Để xác minh tất cả các module và API endpoints hoạt động chính xác:
```bash
python3 -m unittest discover tests
```

---

## 📡 Danh Sách Các Nguồn Dữ Liệu & API Khai Thác
- **NASA Open APIs:** Planetary APOD & NeoWS Asteroid REST API (`api.nasa.gov`)
- **NASA Mars Mission Raw Feeds:** Mars Rover Raw Images (`mars.nasa.gov`)
- **WhereTheISS & Open-Notify:** ISS Real-Time Satellite Tracking & Astronaut Data
- **Spaceflight News API (SNAPI):** Live Spaceflight News Database
- **RSS Feeds:** Space.com, NASA News, SciTechDaily
