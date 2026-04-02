from selenium.webdriver.common.by import By
import time
from .base_page import BasePage
from selenium.webdriver.support import expected_conditions as EC


class PostDetailPage(BasePage):
    """Page Object для страницы деталей поста"""
    
    # Локаторы
    POST_DETAIL = (By.CLASS_NAME, "post-detail")
    POST_TITLE = (By.CLASS_NAME, "post-detail-title")
    POST_CONTENT = (By.CLASS_NAME, "post-detail-content")
    COMMENTS_LIST = (By.CLASS_NAME, "comments-list")
    COMMENT_ITEM = (By.CLASS_NAME, "comment-item")
    ADD_COMMENT_BUTTON = (By.XPATH, "//button[contains(., 'Добавить') or contains(., 'Reply')]")
    COMMENT_INPUT = (By.CLASS_NAME, "comment-input")
    SEND_COMMENT_BUTTON = (By.XPATH, "//button[contains(., 'Отправить') or contains(., 'Send')]")
    EDIT_BUTTON = (By.XPATH, "//button[contains(., 'Редактировать') or contains(., 'Edit')]")
    DELETE_BUTTON = (By.XPATH, "//button[contains(., 'Удалить') or contains(., 'Delete')]")
    
    def open_post(self, post_id: int):
        """Открывает пост по ID"""
        self.open(f"/posts/{post_id}")
        time.sleep(2)
        return self
    
    def get_post_title(self):
        """Получает заголовок поста"""
        try:
            title_element = self.driver.find_element(*self.POST_TITLE)
            return title_element.text
        except:
            return None
    
    def get_post_content(self):
        """Получает содержание поста"""
        try:
            content_element = self.driver.find_element(*self.POST_CONTENT)
            return content_element.text
        except:
            return None
    
    def get_comments_count(self):
        """Возвращает количество комментариев"""
        try:
            self.wait.until(EC.presence_of_all_elements_located(self.COMMENT_ITEM))
            comments = self.driver.find_elements(*self.COMMENT_ITEM)
            return len(comments)
        except:
            return 0
    
    def add_comment(self, text: str):
        """Добавляет комментарий"""
        self.click(self.ADD_COMMENT_BUTTON)
        time.sleep(1)
        self.type_text(self.COMMENT_INPUT, text)
        time.sleep(0.5)
        self.click(self.SEND_COMMENT_BUTTON)
        time.sleep(1)
        return self
    
    def is_post_detail_visible(self):
        """Проверяет видна ли страница деталей поста"""
        try:
            self.wait.until(EC.presence_of_element_located(self.POST_DETAIL))
            return True
        except:
            return False
    
    def click_edit_post(self):
        """Кликает на кнопку редактирования поста"""
        self.click(self.EDIT_BUTTON)
        time.sleep(1)
        return self
    
    def click_delete_post(self):
        """Кликает на кнопку удаления поста"""
        self.click(self.DELETE_BUTTON)
        time.sleep(1)
        return self
