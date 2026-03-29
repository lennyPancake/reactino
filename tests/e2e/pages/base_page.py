from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from .base_element import BaseElement


class BasePage(BaseElement):
    def __init__(self, driver, base_url: str):
        super().__init__(driver) # Инициализируем родительский BaseElement
        self.base_url = base_url.rstrip('/')

    def open(self, path: str = ""):
        url = f"{self.base_url}/{path.lstrip('/')}" if path else self.base_url
        self.driver.get(url)
        return self