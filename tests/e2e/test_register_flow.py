import sys
from pathlib import Path
import pytest
import time

sys.path.insert(0, str(Path(__file__).parent))

from pages.register_page import RegisterPage


@pytest.mark.e2e
class TestAuthFlow:

    def test_full_registration(self, driver, base_url):
        unique_email = f"testuser_{int(time.time())}@example.com"
        password = "TestPassword123!"

        print(f"Тест начинается с email: {unique_email}")

        register_page = RegisterPage(driver, base_url)   # ← передаём base_url
        register_page.register(
            email=unique_email,
            password=password,
            first_name="АвтоТест",
            last_name="Пользователь"
        )

        print(f"Текущий URL после регистрации: {driver.current_url}")
        assert any(x in driver.current_url for x in ["login", "posts", "feed"]), \
            f"Не произошёл редирект. Текущий URL: {driver.current_url}"

        print("✅ Тест регистрации прошёл успешно")