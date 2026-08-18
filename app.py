import streamlit as st
import os

# Set Streamlit Page Configuration
st.set_page_config(
    page_title="Thám Hiểm Thiên Văn Học (Cosmic Explorer)",
    page_icon="🌌",
    layout="wide",
    initial_sidebar_state="expanded"
)

# High-contrast Space Dark Theme CSS
st.markdown("""
<style>
    /* Dark theme background and base text colors */
    html, body, [data-testid="stAppViewContainer"] {
        background-color: #0B0E14 !important;
        color: #F0F6FC !important;
    }

    /* Target all markdown, labels, widgets text for maximum readability */
    p, span, label, h1, h2, h3, h4, h5, h6, .stMarkdown {
        color: #F0F6FC !important;
    }

    /* Custom Header styling */
    .main-header {
        font-size: 2.6rem;
        font-weight: 800;
        background: linear-gradient(90deg, #00D2FF, #8E2DE2, #FF007F);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        margin-bottom: 0.5rem;
    }

    .sub-header {
        font-size: 1.15rem;
        color: #C9D1D9 !important;
        margin-bottom: 2rem;
    }

    /* Sidebar Styling */
    [data-testid="stSidebar"] {
        background-color: #161B22 !important;
        border-right: 1px solid #30363D;
    }

    /* Metrics Styling */
    div[data-testid="stMetricValue"] {
        font-size: 2rem !important;
        color: #58A6FF !important;
        font-weight: 700;
    }

    div[data-testid="stMetricLabel"] {
        color: #8B949E !important;
    }

    /* Expanders & Cards */
    .streamlit-expanderHeader {
        background-color: #21262D !important;
        color: #F0F6FC !important;
    }

    /* Inputs & Selectboxes */
    input, select, textarea {
        color: #FFFFFF !important;
    }
</style>
""", unsafe_allow_html=True)

# Import module pages & translations
from modules.translations import t
from modules.apod import render_apod_page
from modules.iss_tracker import render_iss_page
from modules.neo import render_neo_page
from modules.mars_rover import render_mars_rover_page
from modules.news import render_news_page
from modules.stargazing import render_stargazing_page

def main():
    st.sidebar.image("https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400", use_container_width=True)
    st.sidebar.markdown("# 🚀 **Cosmic Explorer**")
    st.sidebar.divider()

    # Language Switcher
    lang_choice = st.sidebar.radio("🌐 Ngôn ngữ / Language:", ["Tiếng Việt (VI)", "English (EN)"])
    lang = "vi" if "Việt" in lang_choice else "en"

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
