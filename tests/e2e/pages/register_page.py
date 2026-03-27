from selenium.webdriver.common.by import By
import time
from .base_page import BasePage

class RegisterPage(BasePage):
    # Локаторы
    EMAIL_INPUT = (By.NAME, "email")
    PASSWORD_INPUT = (By.NAME, "password")
    FIRST_NAME_INPUT = (By.NAME, "first_name")
    LAST_NAME_INPUT = (By.NAME, "last_name")
    REGISTER_BUTTON = (By.XPATH, "//button[contains(., 'Register') or contains(., 'Зарегистрироваться')]")

    def register(self, email: str, password: str, first_name: str = "Test", last_name: str = "User"):
        self.open("/register")                    
        time.sleep(30)
        self.type_text(self.EMAIL_INPUT, email)
        self.type_text(self.PASSWORD_INPUT, password)
        self.type_text(self.FIRST_NAME_INPUT, first_name)
        self.type_text(self.LAST_NAME_INPUT, last_name)
        self.click(self.REGISTER_BUTTON)
        return self