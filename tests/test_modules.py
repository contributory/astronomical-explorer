import unittest
from datetime import date
from modules.apod import get_apod_data
from modules.iss_tracker import get_iss_location, get_people_in_space
from modules.neo import get_neo_feed, process_neo_data
from modules.mars_rover import get_mars_rover_photos
from modules.news import fetch_rss_news, fetch_snapi_news
from modules.stargazing import calculate_planet_positions

class TestAstronomyModules(unittest.TestCase):

    def test_apod_data(self):
        data, err = get_apod_data(date(2024, 1, 1))
        self.assertIsNone(err)
        self.assertIsNotNone(data)
        self.assertIn("title", data)

    def test_iss_location(self):
        data, err = get_iss_location()
        self.assertIsNone(err)
        self.assertIsNotNone(data)
        self.assertIn("latitude", data)
        self.assertIn("longitude", data)

    def test_people_in_space(self):
        data, err = get_people_in_space()
        self.assertIsNone(err)
        self.assertIsNotNone(data)
        self.assertIn("people", data)

    def test_neo_feed_and_process(self):
        start = date(2024, 1, 1)
        end = date(2024, 1, 2)
        data, err = get_neo_feed(start, end)
        self.assertIsNone(err)
        self.assertIsNotNone(data)
        count, df = process_neo_data(data)
        self.assertGreaterEqual(count, 0)
        self.assertFalse(df.empty)

    def test_mars_rover_photos(self):
        photos, err = get_mars_rover_photos("perseverance", num=5)
        self.assertIsNone(err)
        self.assertIsInstance(photos, list)
        self.assertGreater(len(photos), 0)

    def test_snapi_news(self):
        articles, err = fetch_snapi_news()
        self.assertIsNone(err)
        self.assertIsInstance(articles, list)

    def test_stargazing_positions(self):
        df = calculate_planet_positions("2024-01-01 00:00:00")
        self.assertFalse(df.empty)
        self.assertIn("Sun", df["planet"].values)

if __name__ == "__main__":
    unittest.main()
