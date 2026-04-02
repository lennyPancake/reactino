import time

import pytest
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from .pages.login_page import LoginPage
from .pages.posts_page import PostsPage

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
    login = LoginPage(driver, base_url).open_login_page().login(driver)
    return login 

@pytest.hookimpl(tryfirst=True)
def pytest_runtest_makereport(item, call):
    if call.when == "call" and call.excinfo is not None:
        driver = item.funcargs.get("driver")
        if driver:
            timestamp = int(time.time())
            filename = f"screenshot_{item.name}_{timestamp}.png"
            driver.save_screenshot(filename)
            print(f"📸 Скриншот сохранён: {filename}")