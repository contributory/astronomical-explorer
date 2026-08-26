import streamlit as st
import os

# Set Streamlit Page Configuration
st.set_page_config(
    page_title="Thám Hiểm Thiên Văn Học (Cosmic Explorer)",
    page_icon="🌌",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Import module pages & translations
from modules.translations import t
from modules.apod import render_apod_page
from modules.iss_tracker import render_iss_page
from modules.neo import render_neo_page
from modules.mars_rover import render_mars_rover_page
from modules.news import render_news_page
from modules.stargazing import render_stargazing_page

# Full custom UI CSS overrides for Dark, Light, and Auto themes
DARK_CSS = """
<style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

    * {
        font-family: 'Plus Jakarta Sans', -apple-system, sans-serif !important;
    }

    html, body, [data-testid="stAppViewContainer"] {
        background: radial-gradient(circle at 50% 0%, #161B29 0%, #080B10 100%) !important;
        color: #F1F5F9 !important;
    }

    /* Main Container Padding */
    .block-container {
        padding-top: 2rem !important;
        padding-bottom: 3rem !important;
    }

    /* Header styling */
    .main-header {
        font-size: 2.8rem;
        font-weight: 800;
        background: linear-gradient(135deg, #38BDF8 0%, #818CF8 50%, #C084FC 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        letter-spacing: -0.5px;
        margin-bottom: 0.2rem;
    }
    .sub-header {
        font-size: 1.1rem;
        color: #94A3B8 !important;
        margin-bottom: 2rem;
    }

    /* Sidebar Customization */
    [data-testid="stSidebar"] {
        background: rgba(15, 23, 42, 0.95) !important;
        border-right: 1px solid rgba(255, 255, 255, 0.08) !important;
        backdrop-filter: blur(16px);
    }

    /* Radio Inputs Styled as Custom Nav Cards */
    div[data-testid="stRadio"] > label {
        color: #94A3B8 !important;
        font-weight: 600;
        font-size: 0.9rem;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: 8px;
    }

    div[data-testid="stRadio"] div[role="radiogroup"] {
        gap: 8px;
    }

    div[data-testid="stRadio"] div[role="radiogroup"] label {
        background: rgba(30, 41, 59, 0.5) !important;
        border: 1px solid rgba(255, 255, 255, 0.08) !important;
        border-radius: 10px !important;
        padding: 10px 14px !important;
        transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
        cursor: pointer !important;
        width: 100%;
        color: #E2E8F0 !important;
    }

    div[data-testid="stRadio"] div[role="radiogroup"] label:hover {
        background: rgba(56, 189, 248, 0.1) !important;
        border-color: rgba(56, 189, 248, 0.4) !important;
        transform: translateX(4px);
    }

    div[data-testid="stRadio"] div[role="radiogroup"] label[data-checked="true"] {
        background: linear-gradient(135deg, rgba(56, 189, 248, 0.2), rgba(99, 102, 241, 0.2)) !important;
        border: 1px solid #38BDF8 !important;
        color: #38BDF8 !important;
        font-weight: 700 !important;
        box-shadow: 0 4px 14px rgba(56, 189, 248, 0.15);
    }

    /* Custom Input Controls & Selectboxes */
    div[data-baseweb="input"], div[data-baseweb="select"] > div {
        background: rgba(30, 41, 59, 0.6) !important;
        border: 1px solid rgba(255, 255, 255, 0.12) !important;
        border-radius: 10px !important;
        color: #F8FAFC !important;
        transition: all 0.2s ease !important;
    }

    div[data-baseweb="input"]:focus-within, div[data-baseweb="select"] > div:focus-within {
        border-color: #38BDF8 !important;
        box-shadow: 0 0 0 2px rgba(56, 189, 248, 0.25) !important;
    }

    /* Button Override */
    .stButton > button {
        background: linear-gradient(135deg, #38BDF8 0%, #6366F1 100%) !important;
        color: #FFFFFF !important;
        border: none !important;
        border-radius: 10px !important;
        padding: 10px 20px !important;
        font-weight: 700 !important;
        letter-spacing: 0.3px !important;
        box-shadow: 0 4px 14px rgba(56, 189, 248, 0.3) !important;
        transition: all 0.25s ease !important;
    }

    .stButton > button:hover {
        transform: translateY(-2px) !important;
        box-shadow: 0 6px 20px rgba(56, 189, 248, 0.5) !important;
        filter: brightness(1.1);
    }

    /* Custom Metric Display Cards */
    div[data-testid="stMetric"] {
        background: rgba(30, 41, 59, 0.5) !important;
        border: 1px solid rgba(255, 255, 255, 0.08) !important;
        border-radius: 14px !important;
        padding: 16px 20px !important;
        backdrop-filter: blur(12px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2) !important;
    }

    div[data-testid="stMetricValue"] {
        font-size: 2.2rem !important;
        font-weight: 800 !important;
        color: #38BDF8 !important;
    }

    div[data-testid="stMetricLabel"] {
        color: #94A3B8 !important;
        font-weight: 600 !important;
    }

    /* Custom Expanders */
    .streamlit-expanderHeader {
        background: rgba(30, 41, 59, 0.7) !important;
        border: 1px solid rgba(255, 255, 255, 0.1) !important;
        border-radius: 10px !important;
        color: #F8FAFC !important;
        font-weight: 600 !important;
    }

    /* Custom Dataframe styling */
    [data-testid="stDataFrame"] {
        border: 1px solid rgba(255, 255, 255, 0.1) !important;
        border-radius: 12px !important;
        overflow: hidden;
    }
</style>
"""

LIGHT_CSS = """
<style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

    * {
        font-family: 'Plus Jakarta Sans', -apple-system, sans-serif !important;
    }

    html, body, [data-testid="stAppViewContainer"] {
        background: #F8FAFC !important;
        color: #0F172A !important;
    }

    .block-container {
        padding-top: 2rem !important;
        padding-bottom: 3rem !important;
    }

    .main-header {
        font-size: 2.8rem;
        font-weight: 800;
        background: linear-gradient(135deg, #0284C7 0%, #2563EB 50%, #4F46E5 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        letter-spacing: -0.5px;
        margin-bottom: 0.2rem;
    }
    .sub-header {
        font-size: 1.1rem;
        color: #475569 !important;
        margin-bottom: 2rem;
    }

    [data-testid="stSidebar"] {
        background: #FFFFFF !important;
        border-right: 1px solid #E2E8F0 !important;
    }

    div[data-testid="stRadio"] > label {
        color: #64748B !important;
        font-weight: 600;
        font-size: 0.9rem;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    div[data-testid="stRadio"] div[role="radiogroup"] label {
        background: #F1F5F9 !important;
        border: 1px solid #E2E8F0 !important;
        border-radius: 10px !important;
        padding: 10px 14px !important;
        transition: all 0.25s ease !important;
        color: #334155 !important;
    }

    div[data-testid="stRadio"] div[role="radiogroup"] label:hover {
        background: #E2E8F0 !important;
        border-color: #0284C7 !important;
        transform: translateX(4px);
    }

    div[data-testid="stRadio"] div[role="radiogroup"] label[data-checked="true"] {
        background: #E0F2FE !important;
        border: 1px solid #0284C7 !important;
        color: #0284C7 !important;
        font-weight: 700 !important;
    }

    div[data-baseweb="input"], div[data-baseweb="select"] > div {
        background: #FFFFFF !important;
        border: 1px solid #CBD5E1 !important;
        border-radius: 10px !important;
        color: #0F172A !important;
    }

    .stButton > button {
        background: linear-gradient(135deg, #0284C7 0%, #2563EB 100%) !important;
        color: #FFFFFF !important;
        border: none !important;
        border-radius: 10px !important;
        padding: 10px 20px !important;
        font-weight: 700 !important;
        box-shadow: 0 4px 12px rgba(2, 132, 199, 0.25) !important;
    }

    div[data-testid="stMetric"] {
        background: #FFFFFF !important;
        border: 1px solid #E2E8F0 !important;
        border-radius: 14px !important;
        padding: 16px 20px !important;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05) !important;
    }

    div[data-testid="stMetricValue"] {
        font-size: 2.2rem !important;
        font-weight: 800 !important;
        color: #0284C7 !important;
    }
</style>
"""

AUTO_CSS = """
<style>
    @media (prefers-color-scheme: dark) {
        html, body, [data-testid="stAppViewContainer"] {
            background: radial-gradient(circle at 50% 0%, #161B29 0%, #080B10 100%) !important;
            color: #F1F5F9 !important;
        }
        .main-header {
            font-size: 2.8rem;
            font-weight: 800;
            background: linear-gradient(135deg, #38BDF8 0%, #818CF8 50%, #C084FC 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        [data-testid="stSidebar"] {
            background: rgba(15, 23, 42, 0.95) !important;
        }
    }
    @media (prefers-color-scheme: light) {
        html, body, [data-testid="stAppViewContainer"] {
            background: #F8FAFC !important;
            color: #0F172A !important;
        }
        .main-header {
            font-size: 2.8rem;
            font-weight: 800;
            background: linear-gradient(135deg, #0284C7 0%, #2563EB 50%, #4F46E5 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        [data-testid="stSidebar"] {
            background: #FFFFFF !important;
        }
    }
</style>
"""

def main():
    st.sidebar.image("https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400", use_container_width=True)
    st.sidebar.markdown("## 🚀 **Cosmic Explorer**")
    st.sidebar.caption("Khám phá vũ trụ bằng các nguồn dữ liệu trực tiếp")
    st.sidebar.divider()

    # Language Switcher
    lang_choice = st.sidebar.radio("🌐 Ngôn ngữ / Language:", ["Tiếng Việt (VI)", "English (EN)"])
    lang = "vi" if "Việt" in lang_choice else "en"

    # Theme Switcher (Dark, Light, Auto)
    theme_choice = st.sidebar.radio(
        t("theme_label", lang),
        [t("theme_dark", lang), t("theme_light", lang), t("theme_auto", lang)]
    )

    if "Dark" in theme_choice or "Tối" in theme_choice:
        st.markdown(DARK_CSS, unsafe_allow_html=True)
    elif "Light" in theme_choice or "Sáng" in theme_choice:
        st.markdown(LIGHT_CSS, unsafe_allow_html=True)
    else:
        st.markdown(AUTO_CSS, unsafe_allow_html=True)

    st.sidebar.divider()

    menu_options = {
        t("apod", lang): "apod",
        t("iss", lang): "iss",
        t("neo", lang): "neo",
        t("mars", lang): "mars",
        t("stargazing", lang): "stargazing",
        t("news", lang): "news"
    }

    choice = st.sidebar.radio(t("menu_title", lang), list(menu_options.keys()))

    # Global API Key Option in Sidebar
    st.sidebar.divider()
    st.sidebar.subheader(t("nasa_key_label", lang))
    user_api_key = st.sidebar.text_input(t("nasa_key_label", lang), value="", type="password", help=t("nasa_key_help", lang))

    api_key_to_use = user_api_key.strip() if user_api_key.strip() else "DEMO_KEY"

    # Main Header Banner
    st.markdown(f'<div class="main-header">{t("title", lang)}</div>', unsafe_allow_html=True)
    st.markdown(f'<div class="sub-header">{t("subtitle", lang)}</div>', unsafe_allow_html=True)

    # Route navigation
    selected_page = menu_options[choice]

    if selected_page == "apod":
        render_apod_page(api_key=api_key_to_use)
    elif selected_page == "iss":
        render_iss_page()
    elif selected_page == "neo":
        render_neo_page(api_key=api_key_to_use)
    elif selected_page == "mars":
        render_mars_rover_page(api_key=api_key_to_use)
    elif selected_page == "stargazing":
        render_stargazing_page()
    elif selected_page == "news":
        render_news_page()

    # Footer
    st.divider()
    st.caption(t("footer", lang))

if __name__ == "__main__":
    main()
