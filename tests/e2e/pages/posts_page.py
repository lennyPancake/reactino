from selenium.webdriver.common.by import By
import time
from .base_page import BasePage
from selenium.webdriver.support import expected_conditions as EC


class PostsPage(BasePage):
    """Page Object для страницы со списком постов"""
    
    # Локаторы
    POSTS_LIST = (By.CLASS_NAME, "posts-list")
    POST_CARD_CLASS = "post-card"
    POST_TITLE = (By.CLASS_NAME, "post-title")
    POST_CONTENT = (By.CLASS_NAME, "post-content")
    ADD_POST_BUTTON = (By.XPATH, "//button[contains(., 'Новый пост') or contains(., 'Add Post')]")
    POST_ITEM = (By.CLASS_NAME, POST_CARD_CLASS)
    
    def open_posts(self):
        """Открывает страницу со всеми постами"""
        self.open("/posts")
        time.sleep(2)
        return self
    
    def get_post_count(self):
        """Возвращает количество постов на странице"""
        try:
            self.wait.until(EC.presence_of_all_elements_located(self.POST_ITEM))
            posts = self.driver.find_elements(*self.POST_ITEM)
            return len(posts)
        except:
            return 0
    
    def click_add_post_button(self):
        """Кликает на кнопку 'Добавить пост'"""
        self.click(self.ADD_POST_BUTTON)
        time.sleep(1)
        return self
    
    def is_posts_list_visible(self):
        """Проверяет видна ли страница со списком постов"""
        try:
            self.wait.until(EC.presence_of_element_located(self.POSTS_LIST))
            return True
        except:
            return False
    
    def click_post_by_index(self, index: int):
        """Кликает на пост по индексу"""
        posts = self.driver.find_elements(*self.POST_ITEM)
        if index < len(posts):
            posts[index].click()
            time.sleep(2)
            return self
        raise IndexError(f"Post with index {index} not found")
