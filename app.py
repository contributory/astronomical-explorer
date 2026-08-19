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

DARK_CSS = """
<style>
    /* Dark Theme styling */
    html, body, [data-testid="stAppViewContainer"] {
        background: #090D16 !important;
        color: #F0F6FC !important;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    p, span, label, h1, h2, h3, h4, h5, h6, .stMarkdown {
        color: #F0F6FC !important;
    }
    .main-header {
        font-size: 2.8rem;
        font-weight: 800;
        background: linear-gradient(135deg, #00F2FE 0%, #4FACFE 50%, #00D2FF 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        letter-spacing: -0.5px;
        margin-bottom: 0.3rem;
    }
    .sub-header {
        font-size: 1.15rem;
        color: #8B949E !important;
        margin-bottom: 2rem;
    }
    [data-testid="stSidebar"] {
        background: #111622 !important;
        border-right: 1px solid rgba(255, 255, 255, 0.08);
    }
    /* Cards and Containers */
    div[data-testid="stMetric"], div.stCard {
        background: rgba(22, 27, 34, 0.7);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        padding: 18px;
        backdrop-filter: blur(10px);
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    }
    div[data-testid="stMetricValue"] {
        font-size: 2.2rem !important;
        color: #38BDF8 !important;
        font-weight: 800;
    }
    div[data-testid="stMetricLabel"] {
        color: #94A3B8 !important;
        font-weight: 500;
    }
    /* Buttons */
    .stButton > button {
        background: linear-gradient(135deg, #2563EB, #1D4ED8) !important;
        color: #FFFFFF !important;
        border-radius: 8px !important;
        border: none !important;
        font-weight: 600 !important;
        transition: all 0.3s ease !important;
        box-shadow: 0 2px 10px rgba(37, 99, 235, 0.3) !important;
    }
    .stButton > button:hover {
        transform: translateY(-2px) !important;
        box-shadow: 0 4px 15px rgba(37, 99, 235, 0.5) !important;
    }
    /* Expanders */
    .streamlit-expanderHeader {
        background-color: #1E293B !important;
        color: #F8FAFC !important;
        border-radius: 8px !important;
    }
</style>
"""

LIGHT_CSS = """
<style>
    /* Light Theme styling */
    html, body, [data-testid="stAppViewContainer"] {
        background: #F8FAFC !important;
        color: #0F172A !important;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    p, span, label, h1, h2, h3, h4, h5, h6, .stMarkdown {
        color: #0F172A !important;
    }
    .main-header {
        font-size: 2.8rem;
        font-weight: 800;
        background: linear-gradient(135deg, #0284C7 0%, #2563EB 50%, #4F46E5 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        letter-spacing: -0.5px;
        margin-bottom: 0.3rem;
    }
    .sub-header {
        font-size: 1.15rem;
        color: #475569 !important;
        margin-bottom: 2rem;
    }
    [data-testid="stSidebar"] {
        background: #FFFFFF !important;
        border-right: 1px solid #E2E8F0;
    }
    /* Cards and Containers */
    div[data-testid="stMetric"], div.stCard {
        background: #FFFFFF;
        border: 1px solid #E2E8F0;
        border-radius: 12px;
        padding: 18px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    }
    div[data-testid="stMetricValue"] {
        font-size: 2.2rem !important;
        color: #0284C7 !important;
        font-weight: 800;
    }
    div[data-testid="stMetricLabel"] {
        color: #64748B !important;
        font-weight: 500;
    }
    /* Buttons */
    .stButton > button {
        background: linear-gradient(135deg, #0284C7, #2563EB) !important;
        color: #FFFFFF !important;
        border-radius: 8px !important;
        border: none !important;
        font-weight: 600 !important;
        box-shadow: 0 2px 8px rgba(2, 132, 199, 0.2) !important;
    }
    .stButton > button:hover {
        transform: translateY(-2px) !important;
        box-shadow: 0 4px 12px rgba(2, 132, 199, 0.4) !important;
    }
    /* Expanders */
    .streamlit-expanderHeader {
        background-color: #F1F5F9 !important;
        color: #0F172A !important;
        border-radius: 8px !important;
    }
</style>
"""

AUTO_CSS = """
<style>
    @media (prefers-color-scheme: dark) {
        html, body, [data-testid="stAppViewContainer"] {
            background: #090D16 !important;
            color: #F0F6FC !important;
        }
        p, span, label, h1, h2, h3, h4, h5, h6, .stMarkdown {
            color: #F0F6FC !important;
        }
        .main-header {
            font-size: 2.8rem;
            font-weight: 800;
            background: linear-gradient(135deg, #00F2FE 0%, #4FACFE 50%, #00D2FF 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 0.3rem;
        }
        .sub-header {
            font-size: 1.15rem;
            color: #8B949E !important;
            margin-bottom: 2rem;
        }
        [data-testid="stSidebar"] {
            background: #111622 !important;
            border-right: 1px solid rgba(255, 255, 255, 0.08);
        }
        div[data-testid="stMetric"] {
            background: rgba(22, 27, 34, 0.7);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            padding: 18px;
        }
        div[data-testid="stMetricValue"] {
            font-size: 2.2rem !important;
            color: #38BDF8 !important;
            font-weight: 800;
        }
    }
    @media (prefers-color-scheme: light) {
        html, body, [data-testid="stAppViewContainer"] {
            background: #F8FAFC !important;
            color: #0F172A !important;
        }
        p, span, label, h1, h2, h3, h4, h5, h6, .stMarkdown {
            color: #0F172A !important;
        }
        .main-header {
            font-size: 2.8rem;
            font-weight: 800;
            background: linear-gradient(135deg, #0284C7 0%, #2563EB 50%, #4F46E5 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 0.3rem;
        }
        .sub-header {
            font-size: 1.15rem;
            color: #475569 !important;
            margin-bottom: 2rem;
        }
        [data-testid="stSidebar"] {
            background: #FFFFFF !important;
            border-right: 1px solid #E2E8F0;
        }
        div[data-testid="stMetric"] {
            background: #FFFFFF;
            border: 1px solid #E2E8F0;
            border-radius: 12px;
            padding: 18px;
        }
        div[data-testid="stMetricValue"] {
            font-size: 2.2rem !important;
            color: #0284C7 !important;
            font-weight: 800;
        }
    }
</style>
"""

def main():
    st.sidebar.image("https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400", use_container_width=True)
    st.sidebar.markdown("# 🚀 **Cosmic Explorer**")
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
