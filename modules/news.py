import requests
import feedparser
from bs4 import BeautifulSoup
import streamlit as st
import pandas as pd
from datetime import datetime

RSS_FEEDS = {
    "Space.com": "https://www.space.com/feeds/all",
    "NASA News": "https://www.nasa.gov/news-release/feed/",
    "SciTechDaily Space": "https://scitechdaily.com/news/space/feed/",
}

@st.cache_data(ttl=1800)
def fetch_rss_news(feed_url):
    """
    Parse articles from RSS feed URL.
    """
    try:
        feed = feedparser.parse(feed_url)
        articles = []
        for entry in feed.entries:
            title = entry.get("title", "Không có tiêu đề")
            link = entry.get("link", "#")
            published = entry.get("published", entry.get("updated", "Vừa xong"))
            summary = entry.get("summary", entry.get("description", ""))

            # Clean HTML tags from summary
            if summary:
                soup = BeautifulSoup(summary, "html.parser")
                summary_text = soup.get_text(separator=" ", strip=True)
            else:
                summary_text = ""

            articles.append({
                "title": title,
                "link": link,
                "published": published,
                "summary": summary_text[:250] + "..." if len(summary_text) > 250 else summary_text,
                "source": feed.feed.get("title", "Nguồn Thiên Văn")
            })
        return articles, None
    except Exception as e:
        return [], f"Lỗi đọc tin RSS: {str(e)}"

@st.cache_data(ttl=1800)
def fetch_snapi_news():
    """
    Fetch space news using Spaceflight News API (SNAPI v4)
    """
    url = "https://api.spaceflightnewsapi.net/v4/articles/?limit=15"
    try:
        res = requests.get(url, timeout=10)
        if res.status_code == 200:
            results = res.json().get("results", [])
            articles = []
            for item in results:
                articles.append({
                    "title": item.get("title"),
                    "link": item.get("url"),
                    "published": item.get("published_at"),
                    "summary": item.get("summary"),
                    "image_url": item.get("image_url"),
                    "news_site": item.get("news_site")
                })
            return articles, None
        return [], f"Lỗi API SNAPI (Mã: {res.status_code})"
    except Exception as e:
        return [], f"Lỗi kết nối SNAPI: {str(e)}"

def render_news_page():
    st.header("📰 Tin Tức & Khám Phá Thiên Văn Mới Nhất")
    st.markdown("Cập nhật tự động và cào dữ liệu bài báo, phát hiện vũ trụ mới nhất từ các nguồn uy tín hàng đầu thế giới.")

    tab1, tab2 = st.tabs(["🚀 Spaceflight News API (SNAPI)", "📡 Kênh Dòng Tin RSS (Space.com / NASA)"])

    with tab1:
        st.subheader("🌐 Bài Báo Mới Nhất Từ Các Hãng Thông Tấn Vũ Trụ")
        with st.spinner("Đang tải tin tức SNAPI..."):
            snapi_articles, err = fetch_snapi_news()

        if err:
            st.warning(err)
        elif snapi_articles:
            search_query = st.text_input("🔍 Tìm kiếm bài viết (SNAPI):", "")

            filtered_articles = snapi_articles
            if search_query:
                filtered_articles = [a for a in snapi_articles if search_query.lower() in a["title"].lower() or search_query.lower() in a["summary"].lower()]

            for art in filtered_articles:
                with st.container():
                    col_img, col_text = st.columns([1, 3])
                    with col_img:
                        if art.get("image_url"):
                            st.image(art["image_url"], use_container_width=True)
                        else:
                            st.write("🌌")
                    with col_text:
                        st.markdown(f"### [{art['title']}]({art['link']})")
                        st.caption(f"Nguồn: **{art['news_site']}** | Đăng ngày: {art['published'][:10] if art['published'] else 'N/A'}")
                        st.write(art['summary'])
                    st.divider()

    with tab2:
        st.subheader("📻 Tổng Hợp Dòng Tin RSS Cập Nhật Liên Tục")
        selected_feed_name = st.selectbox("Chọn nguồn tin RSS:", list(RSS_FEEDS.keys()))
        feed_url = RSS_FEEDS[selected_feed_name]

        with st.spinner(f"Đang đọc dòng tin từ {selected_feed_name}..."):
            rss_articles, rss_err = fetch_rss_news(feed_url)

        if rss_err:
            st.error(rss_err)
        elif rss_articles:
            for art in rss_articles:
                with st.expander(f"📌 {art['title']}"):
                    st.caption(f"Thời gian: {art['published']}")
                    st.write(art['summary'])
                    st.markdown(f"👉 [Đọc toàn bộ bài viết tại đây]({art['link']})")
