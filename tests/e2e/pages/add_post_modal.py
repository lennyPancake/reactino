from selenium.webdriver.common.by import By
import time
from .base_page import BasePage
from selenium.webdriver.support import expected_conditions as EC


class AddPostModal(BasePage):
    """Page Object для модала добавления поста"""
    
    # Локаторы
    MODAL = (By.CSS_SELECTOR, '[data-testid="add-post-modal"]')
    TITLE_INPUT = (By.NAME, "title")
    CONTENT_INPUT = (By.NAME, "content")
    SUBMIT_BUTTON = (By.XPATH, "//button[contains(., 'Опубликовать')]")
    CANCEL_BUTTON = (By.XPATH, "//button[contains(., 'Отмена')]")
    IMAGE_INPUT = (By.NAME, "image")
    CONFIRM_DOWNLOAD_TITLE = (By.CLASS_NAME, "upload-success")
    
    def wait_for_modal(self):
        """Ожидает появления модала"""
        self.wait.until(EC.presence_of_element_located(self.MODAL))
        time.sleep(1)
        return self
    
    def fill_post_form(self, title: str, content: str):
        """Заполняет форму поста"""
        self.type_text(self.TITLE_INPUT, title)
        time.sleep(0.5)
        self.type_text(self.CONTENT_INPUT, content)
        return self
    
    def submit_post(self):
        """Отправляет форму поста"""
        self.click(self.SUBMIT_BUTTON)
        time.sleep(2)
        return self
    
    def cancel_post(self):
        """Отменяет добавление поста"""
        self.click(self.CANCEL_BUTTON)
        time.sleep(1)
        return self
    
    def is_modal_visible(self):
        """Проверяет видна ли модал окно"""
        try:
            self.wait.until(EC.visibility_of_element_located(self.MODAL))
            return True
        except:
            return False
    def is_upload_successful(self):
        """Проверяет успешность загрузки изображения"""
        try:
            self.wait.until(EC.visibility_of_element_located(self.CONFIRM_DOWNLOAD_TITLE))
            return True
        except:
            return False
