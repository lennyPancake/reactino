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
    driver.implicitly_wait(10)
    
    yield driver
    driver.quit()


@pytest.fixture(scope="session")
def base_url():
    return "http://frontend:3000"


@pytest.fixture(scope="function")
def wait(driver):
    return WebDriverWait(driver, 20)