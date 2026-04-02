import time
from selenium.webdriver.common.by import By
from .base_page import BasePage
from selenium.webdriver.support import expected_conditions as EC

class LoginPage(BasePage):
    """Page Object для страницы логина"""
    
    # Локаторы
    LOGIN_FORM = (By.CLASS_NAME, "auth-form")
    USERNAME_INPUT = (By.NAME, "email")
    PASSWORD_INPUT = (By.NAME, "password")
    LOGIN_BUTTON = (By.XPATH, "//button[contains(., 'Войти')]")
    
    def open_login_page(self):
        """Открывает страницу логина"""
        self.open("/login")
        time.sleep(2)
        return self
    
    def login(self,driver, username: str="1@mail.ru", password: str="1234"):
        if self.is_login_form_visible():
            """Выполняет вход в систему"""
            self.type_text(self.USERNAME_INPUT, username)
            time.sleep(0.5)
            self.type_text(self.PASSWORD_INPUT, password)
            time.sleep(0.5)
            self.click(self.LOGIN_BUTTON)
            time.sleep(2)
            return self
        else:
            print("Форма логина не найдена на странице")
            return None
    
    def is_login_form_visible(self):
        """Проверяет видна ли форма логина"""
        try:
            self.wait.until(EC.visibility_of_element_located(self.LOGIN_FORM))
            return True
        except:
            return False