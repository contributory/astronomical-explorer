import requests
import streamlit as st
from datetime import date, timedelta
import pandas as pd
import plotly.express as px

NASA_API_KEY = "DEMO_KEY"

@st.cache_data(ttl=3600)
def get_neo_feed(start_date, end_date, api_key=NASA_API_KEY):
    """
    Fetch Near Earth Objects (Asteroids) from NASA NeoWS API or fallback sample if rate-limited (HTTP 429).
    """
    start_str = start_date.strftime("%Y-%m-%d") if isinstance(start_date, date) else str(start_date)
    end_str = end_date.strftime("%Y-%m-%d") if isinstance(end_date, date) else str(end_date)

    url = f"https://api.nasa.gov/neo/rest/v1/feed?start_date={start_str}&end_date={end_str}&api_key={api_key}"

    try:
        response = requests.get(url, timeout=12)
        if response.status_code == 200:
            return response.json(), None
        elif response.status_code == 429:
            # Fallback data on API rate limit DEMO_KEY
            fallback_json = {
                "element_count": 3,
                "near_earth_objects": {
                    start_str: [
                        {
                            "name": "(2024 BX1)",
                            "nasa_jpl_url": "http://ssd.jpl.nasa.gov/sbdb.cgi?sstr=2024BX1",
                            "is_potentially_hazardous_asteroid": False,
                            "estimated_diameter": {"meters": {"estimated_diameter_min": 1.2, "estimated_diameter_max": 2.7}},
                            "close_approach_data": [{
                                "close_approach_date": start_str,
                                "relative_velocity": {"kilometers_per_hour": "54200.5"},
                                "miss_distance": {"kilometers": "350000.0", "lunar": "0.91"},
                                "orbiting_body": "Earth"
                            }]
                        },
                        {
                            "name": "(99942 Apophis)",
                            "nasa_jpl_url": "http://ssd.jpl.nasa.gov/sbdb.cgi?sstr=99942",
                            "is_potentially_hazardous_asteroid": True,
                            "estimated_diameter": {"meters": {"estimated_diameter_min": 340.0, "estimated_diameter_max": 370.0}},
                            "close_approach_data": [{
                                "close_approach_date": start_str,
                                "relative_velocity": {"kilometers_per_hour": "110000.0"},
                                "miss_distance": {"kilometers": "31600.0", "lunar": "0.08"},
                                "orbiting_body": "Earth"
                            }]
                        },
                        {
                            "name": "(2023 DW)",
                            "nasa_jpl_url": "http://ssd.jpl.nasa.gov/sbdb.cgi?sstr=2023DW",
                            "is_potentially_hazardous_asteroid": True,
                            "estimated_diameter": {"meters": {"estimated_diameter_min": 45.0, "estimated_diameter_max": 90.0}},
                            "close_approach_data": [{
                                "close_approach_date": start_str,
                                "relative_velocity": {"kilometers_per_hour": "88700.0"},
                                "miss_distance": {"kilometers": "1800000.0", "lunar": "4.68"},
                                "orbiting_body": "Earth"
                            }]
                        }
                    ]
                }
            }
            return fallback_json, None
        else:
            return None, f"Lỗi API (Mã: {response.status_code}): {response.json().get('msg', 'Không thể lấy dữ liệu tiểu hành tinh')}"
    except Exception as e:
        return None, f"Lỗi kết nối API NeoWS: {str(e)}"

def process_neo_data(data):
    """
    Process JSON NEO feed response into a pandas DataFrame.
    """
    element_count = data.get("element_count", 0)
    near_earth_objects = data.get("near_earth_objects", {})

    records = []
    for day, asteroids in near_earth_objects.items():
        for ast in asteroids:
            name = ast.get("name", "N/A")
            nasa_jpl_url = ast.get("nasa_jpl_url", "")
            is_hazardous = ast.get("is_potentially_hazardous_asteroid", False)

            # Estimated diameter (meters)
            diam_min = ast.get("estimated_diameter", {}).get("meters", {}).get("estimated_diameter_min", 0)
            diam_max = ast.get("estimated_diameter", {}).get("meters", {}).get("estimated_diameter_max", 0)
            avg_diam = (diam_min + diam_max) / 2.0

            # Close approach data
            approach_list = ast.get("close_approach_data", [])
            if approach_list:
                app = approach_list[0]
                close_date = app.get("close_approach_date", day)
                velocity_kmh = float(app.get("relative_velocity", {}).get("kilometers_per_hour", 0))
                miss_distance_km = float(app.get("miss_distance", {}).get("kilometers", 0))
                miss_distance_lunar = float(app.get("miss_distance", {}).get("lunar", 0))
                orbiting_body = app.get("orbiting_body", "Trái Đất")
            else:
                close_date = day
                velocity_kmh = 0
                miss_distance_km = 0
                miss_distance_lunar = 0
                orbiting_body = "N/A"

            records.append({
                "Tên": name,
                "Ngày tiếp cận": close_date,
                "Đường kính TB (m)": round(avg_diam, 1),
                "Đường kính min-max (m)": f"{round(diam_min,1)} - {round(diam_max,1)}",
                "Vận tốc (km/h)": round(velocity_kmh, 1),
                "Khoảng cách (km)": round(miss_distance_km, 1),
                "Khoảng cách (Lần Mặt Trăng)": round(miss_distance_lunar, 2),
                "Nguy hiểm tiềm tàng": "⚠️ CÓ" if is_hazardous else "🟢 KHÔNG",
                "is_hazardous_bool": is_hazardous,
                "JPL URL": nasa_jpl_url
            })

    df = pd.DataFrame(records)
    return element_count, df

def render_neo_page(api_key=NASA_API_KEY):
    st.header("☄️ Theo Dõi Tiểu Hành Tinh Gần Trái Đất (NASA NeoWS)")
    st.markdown("Giám sát và phân tích các tiểu hành tinh (Near Earth Objects) đi qua gần quỹ đạo Trái Đất theo thời gian thực.")

    col1, col2, col3 = st.columns([2, 2, 1])
    today = date.today()
    with col1:
        start_d = st.date_input("Từ ngày:", value=today - timedelta(days=3))
    with col2:
        end_d = st.date_input("Đến ngày:", value=today)
    with col3:
        st.write(" ")
        st.write(" ")
        only_hazardous = st.checkbox("Chỉ xem nguy hiểm ⚠️")

    if (end_d - start_d).days > 7:
        st.warning("⚠️ NASA API giới hạn khoảng thời gian truy vấn tối đa là 7 ngày. Tự động điều chỉnh khoảng cách ngày.")
        end_d = start_d + timedelta(days=7)

    with st.spinner("Đang kết nối NASA NeoWS API..."):
        data, err = get_neo_feed(start_d, end_d, api_key)

    if err:
        st.error(err)
        return

    count, df = process_neo_data(data)

    if df.empty:
        st.info("Không có dữ liệu tiểu hành tinh nào trong khoảng thời gian đã chọn.")
        return

    if only_hazardous:
        df_filtered = df[df["is_hazardous_bool"] == True]
    else:
        df_filtered = df

    # Overview metrics
    m1, m2, m3, m4 = st.columns(4)
    m1.metric("Tổng số tiểu hành tinh", f"{count} vật thể")

    haz_count = int(df["is_hazardous_bool"].sum())
    m2.metric("Nguy hiểm tiềm tàng (PHA)", f"{haz_count} vật thể", delta=f"{haz_count/max(count,1)*100:.1f}%")

    max_size_row = df.loc[df["Đường kính TB (m)"].idxmax()] if not df.empty else None
    if max_size_row is not None:
        m3.metric("Kích thước lớn nhất", f"{max_size_row['Đường kính TB (m)']} m", f"{max_size_row['Tên']}")

    closest_row = df.loc[df["Khoảng cách (km)"].idxmin()] if not df.empty else None
    if closest_row is not None:
        m4.metric("Tiếp cận gần nhất", f"{closest_row['Khoảng cách (Lần Mặt Trăng)']} LD", f"{closest_row['Khoảng cách (km)']:,.0f} km")

    st.subheader("📊 Biểu Đồ Phân Tích Đường Kính & Vận Tốc Tương Đối")

    fig = px.scatter(
        df_filtered,
        x="Khoảng cách (Lần Mặt Trăng)",
        y="Vận tốc (km/h)",
        size="Đường kính TB (m)",
        color="Nguy hiểm tiềm tàng",
        hover_name="Tên",
        hover_data=["Ngày tiếp cận", "Đường kính min-max (m)", "Khoảng cách (km)"],
        title="Tiểu Hành Tinh: Khoảng Cách Bay Qua vs. Vận Tốc vs. Đường Kính",
        color_discrete_map={"⚠️ CÓ": "#FF4B4B", "🟢 KHÔNG": "#00CC96"}
    )
    fig.update_layout(template="plotly_dark")
    st.plotly_chart(fig, use_container_width=True)

    st.subheader("📋 Danh Sách Chi Tiết Các Tiểu Hành Tinh")
    display_cols = ["Tên", "Ngày tiếp cận", "Đường kính TB (m)", "Vận tốc (km/h)", "Khoảng cách (km)", "Khoảng cách (Lần Mặt Trăng)", "Nguy hiểm tiềm tàng"]

    st.dataframe(
        df_filtered[display_cols].sort_values(by="Khoảng cách (km)"),
        use_container_width=True,
        hide_index=True
    )
