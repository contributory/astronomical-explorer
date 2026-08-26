import requests
import streamlit as st
import pandas as pd
import folium
from streamlit_folium import st_folium

@st.cache_data(ttl=15)
def get_iss_location():
    """
    Fetch current position of International Space Station using WhereTheISS API.
    """
    try:
        url = "https://api.wheretheiss.at/v1/satellites/25544"
        res = requests.get(url, timeout=8)
        if res.status_code == 200:
            data = res.json()
            lat = float(data["latitude"])
            lon = float(data["longitude"])
            altitude = float(data.get("altitude", 0))
            velocity = float(data.get("velocity", 0))
            visibility = data.get("visibility", "unknown")
            return {
                "latitude": lat,
                "longitude": lon,
                "altitude": round(altitude, 2),
                "velocity": round(velocity, 2),
                "visibility": visibility
            }, None
        return None, f"HTTP Error {res.status_code}"
    except Exception as e:
        return None, f"Lỗi truy vấn vị trí ISS: {str(e)}"

@st.cache_data(ttl=300)
def get_people_in_space():
    """
    Fetch list of humans currently in space from Open-Notify or fallback data if offline.
    """
    try:
        url = "http://api.open-notify.org/astros.json"
        res = requests.get(url, timeout=5)
        if res.status_code == 200:
            return res.json(), None
    except Exception:
        pass

    # Fallback status if open-notify times out
    return {
        "number": 10,
        "people": [
            {"name": "Oleg Kononenko", "craft": "ISS"},
            {"name": "Nikolai Chub", "craft": "ISS"},
            {"name": "Tracy Caldwell Dyson", "craft": "ISS"},
            {"name": "Matthew Dominick", "craft": "ISS"},
            {"name": "Michael Barratt", "craft": "ISS"},
            {"name": "Jeanette Epps", "craft": "ISS"},
            {"name": "Alexander Grebenkin", "craft": "ISS"},
            {"name": "Butch Wilmore", "craft": "ISS"},
            {"name": "Sunita Williams", "craft": "ISS"},
            {"name": "Li Guangsu", "craft": "Tiangong"}
        ]
    }, None

def render_iss_page():
    st.header("🛸 Theo Dõi Trạm Vũ Trụ Quốc Tế (ISS)")
    st.markdown("Cập nhật vị trí thời gian thực của trạm ISS đang bay quanh Trái Đất cùng thông số độ cao, vận tốc và phi hành đoàn.")

    col_btn, col_blank = st.columns([1, 3])
    with col_btn:
        refresh = st.button("🔄 Cập nhật vị trí ngay", use_container_width=True)

    if refresh:
        st.cache_data.clear()

    iss_data, iss_err = get_iss_location()

    col1, col2 = st.columns([3, 2])

    with col1:
        st.subheader("📍 Bản Đồ Vị Trí ISS Trực Tuyến")
        if iss_err:
            st.error(f"Không thể tải bản đồ ISS: {iss_err}")
            m = folium.Map(location=[0, 0], zoom_start=2)
            st_folium(m, height=450, width="100%")
        elif iss_data:
            lat = iss_data["latitude"]
            lon = iss_data["longitude"]

            m1, m2, m3 = st.columns(3)
            m1.metric("Vĩ độ", f"{lat:.4f}°")
            m2.metric("Kinh độ", f"{lon:.4f}°")
            m3.metric("Vận tốc", f"{iss_data['velocity']:,.0f} km/h")

            m = folium.Map(location=[lat, lon], zoom_start=3, tiles="CartoDB dark_matter")

            folium.Marker(
                [lat, lon],
                popup=f"ISS - Độ cao: {iss_data['altitude']} km",
                tooltip="Trạm ISS đang ở đây!",
                icon=folium.Icon(color="red", icon="paper-plane", prefix="fa")
            ).add_to(m)

            folium.CircleMarker(
                radius=14,
                location=[lat, lon],
                color="cyan",
                fill=True,
                fill_color="cyan",
                fill_opacity=0.4
            ).add_to(m)

            st_folium(m, height=400, width="100%", key="iss_map")

    with col2:
        st.subheader("👨‍🚀 Phi Hành Gia Trong Vũ Trụ")
        astros_data, astros_err = get_people_in_space()

        if astros_err:
            st.warning(f"Không lấy được danh sách phi hành gia: {astros_err}")
        elif astros_data:
            number = astros_data.get("number", 0)
            people = astros_data.get("people", [])

            st.metric(label="Tổng số người ngoài vũ trụ hiện tại", value=f"{number} người")

            df_people = pd.DataFrame(people)
            if not df_people.empty:
                df_people.columns = ["Tên Phi Hành Gia", "Tàu / Trạm Vũ Trụ"]
                st.dataframe(df_people, use_container_width=True, hide_index=True)

            st.info("""
            💡 **Thông tin thú vị:**
            - ISS quay quanh Trái Đất mỗi 90 phút (16 lần bình minh & hoàng hôn mỗi ngày).
            - Độ cao quỹ đạo trung bình: **~400 km**.
            """)
