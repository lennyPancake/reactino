import time

import pytest
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait

@pytest.fixture(scope="function")
def driver():
    options = Options()
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    # options.add_argument("--headless")   # раскомментировать при необходимости

    driver = webdriver.Remote(
        command_executor="http://selenium:4444/wd/hub",
        options=options
    )
    driver.maximize_window()
    #driver.implicitly_wait(10)
    
    yield driver
    driver.quit()


@pytest.fixture(scope="session")
def base_url():
    return "http://frontend:3000"


@pytest.fixture(scope="function")
def wait(driver):
    return WebDriverWait(driver, 20)

@pytest.fixture(scope="function")
def auth_user(driver, base_url): #костыль
    from pages.register_page import RegisterPage
    unique_email = f"testuser_{int(time.time())}@example.com"
    password = "TestPassword123!"
    register_page = RegisterPage(driver, base_url)
    register_page.register(
        email=unique_email,
        password=password,
        first_name="АвтоТест",
        last_name="Пользователь"
    )
    return driver

@pytest.hookimpl(tryfirst=True)
def pytest_runtest_makereport(item, call):
    if call.when == "call" and call.excinfo is not None:
        driver = item.funcargs.get("driver")
        if driver:
            timestamp = int(time.time())
            filename = f"screenshot_{item.name}_{timestamp}.png"
            driver.save_screenshot(filename)
            print(f"📸 Скриншот сохранён: {filename}")