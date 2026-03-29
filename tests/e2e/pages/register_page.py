from selenium.webdriver.common.by import By
import time
from .base_page import BasePage

class RegisterPage(BasePage):
    # Локаторы
    EMAIL_INPUT = (By.NAME, "email")
    PASSWORD_INPUT = (By.NAME, "password")
    PASSWORD_REPEAT_INPUT = (By.NAME, "password_repeat")
    FIRST_NAME_INPUT = (By.NAME, "first_name")
    LAST_NAME_INPUT = (By.NAME, "last_name")
    REGISTER_BUTTON = (By.XPATH, "//button[contains(., 'Зарегистрироваться')]")

    def register(self, email: str, password: str, first_name: str = "Test", last_name: str = "User"):
        self.open("/register")                    
        self.type_text(self.EMAIL_INPUT, email)
        self.type_text(self.PASSWORD_INPUT, password)
        self.type_text(self.PASSWORD_REPEAT_INPUT, password)
        self.type_text(self.FIRST_NAME_INPUT, first_name)
        self.type_text(self.LAST_NAME_INPUT, last_name)
        time.sleep(5)  # Небольшая пауза для стабильности теста
        self.click(self.REGISTER_BUTTON)
        time.sleep(5)  # Небольшая пауза для стабильности теста
        return self