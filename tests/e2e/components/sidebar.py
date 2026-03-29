import time
from selenium.webdriver.common.by import By
from pages.base_element import BaseElement

class Sidebar(BaseElement):
    # Локаторы
    SIDEBAR = (By.ID, "sidebar")
    LOGOUT_BUTTON = (By.ID, "logout-item")
    PROFILE_LINK = (By.XPATH, "//a[contains(., 'Profile') or contains(., 'Профиль')]")
    USERS_LINK = (By.XPATH, "//a[contains(., 'Users') or contains(., 'Пользователи')]")
    POSTS_LINK = (By.XPATH, "//a[contains(., 'Posts') or contains(., 'Посты')]")
    DROPDOWN_MENU = (By.ID, "user-dropdown")
    def click_logout(self):
        self.click(self.DROPDOWN_MENU)
        time.sleep(11) 
        self.click(self.LOGOUT_BUTTON)
        time.sleep(5)  # Небольшая пауза для стабильности теста
        return self