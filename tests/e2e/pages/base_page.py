from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By

class BasePage:
    def __init__(self, driver, base_url: str):
        self.driver = driver
        self.base_url = base_url.rstrip('/')  # убираем лишний слеш в конце
        self.wait = WebDriverWait(driver, 20)

    def open(self, path: str = ""):
        url = f"{self.base_url}/{path.lstrip('/')}" if path else self.base_url
        self.driver.get(url)
        return self

    def find(self, locator):
        return self.wait.until(EC.visibility_of_element_located(locator))

    def click(self, locator):
        element = self.wait.until(EC.element_to_be_clickable(locator))
        element.click()
        return self

    def type_text(self, locator, text):
        element = self.find(locator)
        element.clear()
        element.send_keys(text)
        return self

    def get_text(self, locator):
        return self.find(locator).text