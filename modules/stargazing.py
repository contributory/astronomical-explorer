import streamlit as st
import numpy as np
import plotly.graph_objects as go
import pandas as pd
from datetime import datetime
from astropy.coordinates import get_body, EarthLocation
from astropy.time import Time

PLANET_COLORS = {
    "Sun": "#FFD700",
    "Mercury": "#B5A8A6",
    "Venus": "#E3BB76",
    "Earth": "#2B82C5",
    "Mars": "#E27B58",
    "Jupiter": "#C88B3A",
    "Saturn": "#E4D191",
    "Uranus": "#65C2D0",
    "Neptune": "#4B70DD"
}

# Approximate orbital distances in AU for 3D simulation
ORBIT_DISTANCES = {
    "Mercury": 0.387,
    "Venus": 0.723,
    "Earth": 1.000,
    "Mars": 1.524,
    "Jupiter": 5.204,
    "Saturn": 9.582,
    "Uranus": 19.201,
    "Neptune": 30.047
}

@st.cache_data(ttl=3600)
def calculate_planet_positions(obs_time_str):
    """
    Calculate rough 3D position coordinates of planets for visualization.
    """
    t = Time(obs_time_str)
    positions = []

    # Sun at origin
    positions.append({
        "name": "Mặt Trời (Sun)",
        "planet": "Sun",
        "x": 0, "y": 0, "z": 0,
        "size": 25,
        "color": PLANET_COLORS["Sun"]
    })

    for idx, (p_name, r) in enumerate(ORBIT_DISTANCES.items()):
        # Angular speed roughly proportional to Kepler's 3rd law
        period_years = r ** 1.5
        mean_anomaly = (t.jd / (365.25 * period_years)) * 2 * np.pi

        x = r * np.cos(mean_anomaly)
        y = r * np.sin(mean_anomaly)
        z = 0.05 * r * np.sin(mean_anomaly * 2) # Slight inclination effect

        positions.append({
            "name": p_name,
            "planet": p_name,
            "x": round(x, 3),
            "y": round(y, 3),
            "z": round(z, 3),
            "size": max(6, int(15 / (idx + 1) ** 0.3)),
            "color": PLANET_COLORS.get(p_name, "#FFFFFF")
        })

    return pd.DataFrame(positions)

def render_stargazing_page():
    st.header("🪐 Mô Phỏng Hệ Mặt Trời & Tọa Độ Các Hành Tinh")
    st.markdown("Mô phỏng mô hình 3D quỹ đạo chuyển động của các hành tinh trong Hệ Mặt Trời theo mốc thời gian thực tế.")

    dt_input = st.date_input("Chọn thời điểm mô phỏng:", value=datetime.now())
    obs_time_str = dt_input.strftime("%Y-%m-%d %H:%M:%S")

    with st.spinner("Đang tính toán tọa độ hành tinh (Astropy)..."):
        df_planets = calculate_planet_positions(obs_time_str)

    st.subheader("🌌 Mô Hình Vũ Trụ 3D Tương Tác")

    fig = go.Figure()

    # Draw Sun & Planets
    for _, row in df_planets.iterrows():
        fig.add_trace(go.Scatter3d(
            x=[row["x"]],
            y=[row["y"]],
            z=[row["z"]],
            mode="markers+text",
            name=row["name"],
            text=[row["name"]],
            textposition="top center",
            marker=dict(
                size=row["size"],
                color=row["color"],
                opacity=0.9
            )
        ))

    # Draw orbit rings
    theta = np.linspace(0, 2*np.pi, 100)
    for p_name, r in ORBIT_DISTANCES.items():
        x_ring = r * np.cos(theta)
        y_ring = r * np.sin(theta)
        z_ring = np.zeros_like(theta)

        fig.add_trace(go.Scatter3d(
            x=x_ring, y=y_ring, z=z_ring,
            mode="lines",
            name=f"Quỹ đạo {p_name}",
            line=dict(color="rgba(200, 200, 250, 0.2)", width=2),
            showlegend=False
        ))

    fig.update_layout(
        scene=dict(
            xaxis=dict(title="X (AU)", backgroundcolor="black", gridcolor="gray"),
            yaxis=dict(title="Y (AU)", backgroundcolor="black", gridcolor="gray"),
            zaxis=dict(title="Z (AU)", backgroundcolor="black", gridcolor="gray"),
            aspectmode="cube"
        ),
        paper_bgcolor="black",
        plot_bgcolor="black",
        margin=dict(l=0, r=0, b=0, t=30),
        height=650
    )

    st.plotly_chart(fig, use_container_width=True)

    st.subheader("📌 Tọa Độ Tương Đối (Đơn Vị Thiên Văn AU)")
    st.dataframe(df_planets[["name", "x", "y", "z"]], use_container_width=True, hide_index=True)
