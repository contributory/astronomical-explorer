# Multilingual translations dictionary (Vietnamese & English)

TRANSLATIONS = {
    "vi": {
        "title": "✨ Ứng Dụng Khám Phá Thiên Văn Học & Vũ Trụ",
        "subtitle": "Dữ liệu trực tiếp, cập nhật liên tục từ NASA, Open-Notify, SNAPI & các cổng thông tin thiên văn hàng đầu.",
        "menu_title": "Danh mục khám phá:",
        "apod": "🌌 Ảnh Vũ Trụ (APOD)",
        "iss": "🛸 Theo Dõi ISS",
        "neo": "☄️ Tiểu Hành Tinh (NEO)",
        "mars": "🔴 Xe Thám Hiểm Sao Hỏa",
        "stargazing": "🪐 Hệ Mặt Trời 3D",
        "news": "📰 Tin Tức & Cào Dữ Liệu",
        "lang_label": "🌐 Ngôn ngữ / Language",
        "nasa_key_label": "🔑 NASA API Key (Tùy chọn)",
        "nasa_key_help": "Mặc định sử dụng DEMO_KEY. Bạn có thể nhập key riêng tại api.nasa.gov.",
        "footer": "🌌 Xây dựng bằng Streamlit & Python | Dữ liệu mở từ NASA API, Open-Notify, SNAPI, Space.com."
    },
    "en": {
        "title": "✨ Cosmic Explorer & Astronomy Platform",
        "subtitle": "Live data updated in real-time from NASA, Open-Notify, SNAPI & leading space portals.",
        "menu_title": "Exploration Menu:",
        "apod": "🌌 Picture of the Day (APOD)",
        "iss": "🛸 Live ISS Tracker",
        "neo": "☄️ Near Earth Objects (NEO)",
        "mars": "🔴 Mars Rovers Gallery",
        "stargazing": "🪐 3D Solar System",
        "news": "📰 Space News & Scraping",
        "lang_label": "🌐 Language / Ngôn ngữ",
        "nasa_key_label": "🔑 NASA API Key (Optional)",
        "nasa_key_help": "Defaults to DEMO_KEY. You can enter your own key from api.nasa.gov.",
        "footer": "🌌 Built with Streamlit & Python | Open Data from NASA API, Open-Notify, SNAPI, Space.com."
    }
}

def t(key, lang="vi"):
    return TRANSLATIONS.get(lang, TRANSLATIONS["vi"]).get(key, key)
