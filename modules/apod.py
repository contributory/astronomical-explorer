import requests
import streamlit as st
import datetime
from datetime import date, timedelta
import random

NASA_API_KEY = "DEMO_KEY"

@st.cache_data(ttl=3600)
def get_apod_data(selected_date=None, api_key=NASA_API_KEY):
    """
    Fetch NASA Astronomy Picture of the Day for a given date or today if None.
    Handles DEMO_KEY rate limiting (HTTP 429) with fallback data.
    """
    url = f"https://api.nasa.gov/planetary/apod?api_key={api_key}"
    if selected_date:
        if isinstance(selected_date, (date, datetime.date, datetime.datetime)):
            date_str = selected_date.strftime("%Y-%m-%d")
        else:
            date_str = str(selected_date)
        url += f"&date={date_str}"
    else:
        date_str = date.today().strftime("%Y-%m-%d")

    try:
        response = requests.get(url, timeout=10)
        if response.status_code == 200:
            return response.json(), None
        elif response.status_code == 429:
            fallback_data = {
                "title": "M31: Thiên Hà Tiên Nữ (Andromeda Galaxy)",
                "date": date_str,
                "copyright": "Subaru Telescope (NAOJ)",
                "media_type": "image",
                "url": "https://apod.nasa.gov/apod/image/2108/M31_Subaru_1080.jpg",
                "hdurl": "https://apod.nasa.gov/apod/image/2108/M31_Subaru_3422.jpg",
                "explanation": "Thiên hà Tiên Nữ (M31) là thiên hà xoắn ốc lớn gần Hệ Mặt Trời nhất, nằm cách Trái Đất khoảng 2.5 triệu năm ánh sáng. Bức ảnh chụp chi tiết cấu trúc bụi vũ trụ và hàng tỷ ngôi sao thuộc thiên hà hàng xóm của chúng ta."
            }
            return fallback_data, None
        else:
            return None, f"Lỗi API (Mã: {response.status_code}): {response.json().get('msg', 'Không thể tải dữ liệu')}"
    except Exception as e:
        return None, f"Lỗi kết nối: {str(e)}"

def render_apod_page(api_key=NASA_API_KEY):
    st.markdown("""
    <div style="background: linear-gradient(135deg, rgba(56,189,248,0.1), rgba(99,102,241,0.1)); border: 1px solid rgba(56,189,248,0.2); border-radius: 16px; padding: 24px; margin-bottom: 24px;">
        <h2 style="margin-top:0; font-weight:800; color:#38BDF8;">🌌 Ảnh Thiên Văn Trong Ngày (NASA APOD)</h2>
        <p style="margin-bottom:0; color:#94A3B8;">Khám phá bức ảnh vũ trụ tuyệt đẹp được các nhà thiên văn học NASA lựa chọn mỗi ngày kèm phần thuyết minh chuyên sâu.</p>
    </div>
    """, unsafe_allow_html=True)

    col1, col2, col3 = st.columns([2, 1, 1])

    today = date.today()
    min_date = date(1995, 6, 16)

    with col1:
        selected_date = st.date_input("Chọn ngày khám phá:", value=today, min_value=min_date, max_value=today)

    with col2:
        st.write(" ")
        st.write(" ")
        random_btn = st.button("🎲 Bức ảnh ngẫu nhiên", use_container_width=True)

    with col3:
        st.write(" ")
        st.write(" ")
        today_btn = st.button("📅 Hôm nay", use_container_width=True)

    if random_btn:
        start_timestamp = min_date.toordinal()
        end_timestamp = today.toordinal()
        random_ordinal = random.randint(start_timestamp, end_timestamp)
        selected_date = date.fromordinal(random_ordinal)
        st.info(f"Đã chọn ngẫu nhiên ngày: {selected_date.strftime('%d/%m/%Y')}")

    if today_btn:
        selected_date = today

    with st.spinner("Đang tải dữ liệu hình ảnh từ NASA..."):
        data, error = get_apod_data(selected_date, api_key)

    if error:
        st.error(error)
        st.info("💡 Mẹo: Nhận API key miễn phí tại [api.nasa.gov](https://api.nasa.gov/) để không bị giới hạn lượt truy cập DEMO_KEY.")
        return

    if data:
        st.markdown(f"<h3 style='font-size: 1.8rem; font-weight: 700; margin-top: 10px;'>{data.get('title', 'Không có tiêu đề')}</h3>", unsafe_allow_html=True)

        c_meta1, c_meta2, c_meta3 = st.columns(3)
        c_meta1.caption(f"📅 Ngày: {data.get('date', 'N/A')}")
        if "copyright" in data:
            c_meta2.caption(f"📸 Tác giả / Bản quyền: {data.get('copyright')}")
        c_meta3.caption(f"🛰️ Loại media: {data.get('media_type', 'image').upper()}")

        media_type = data.get("media_type", "image")

        if media_type == "image":
            img_url = data.get("url")
            hd_url = data.get("hdurl", img_url)

            st.image(img_url, caption=data.get("title"), use_container_width=True)

            st.markdown(f"🔗 [Xem ảnh chất lượng cao (HD)]({hd_url})")

        elif media_type == "video":
            video_url = data.get("url")
            st.video(video_url)
            st.info(f"Xem video gốc tại: {video_url}")

        else:
            st.warning(f"Định dạng media '{media_type}' chưa được hỗ trợ xem trực tiếp. Link: {data.get('url')}")

        with st.expander("📖 Đọc phần giải thích khoa học", expanded=True):
            st.write(data.get("explanation", "Không có mô tả."))
