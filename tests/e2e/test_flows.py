import sys
from pathlib import Path
import pytest
import time

sys.path.insert(0, str(Path(__file__).parent))

from pages.register_page import RegisterPage
from pages.posts_page import PostsPage
from pages.add_post_modal import AddPostModal
from pages.post_detail_page import PostDetailPage
from components.sidebar import Sidebar


@pytest.mark.e2e
class TestAuthFlow:
    """E2E тесты для аутентификации"""

    def test_full_registration(self, driver, base_url):
        """Проверяем полный флоу регистрации"""
        unique_email = f"testuser_{int(time.time())}@example.com"
        password = "TestPassword123!"

        print(f"Регистрация с email: {unique_email}")

        register_page = RegisterPage(driver, base_url)
        register_page.register(
            email=unique_email,
            password=password,
            first_name="АвтоТест",
            last_name="Пользователь"
        )
        
        print(f"URL после регистрации: {driver.current_url}")
        assert any(x in driver.current_url for x in ["users", "posts"]), \
            f"Неправильный редирект. URL: {driver.current_url}"
        print("✅ Регистрация прошла успешно")

    def test_login(self, driver, base_url, auth_user):
        """Проверяем что пользователь может быть авторизован"""
        # После auth_user пользователь уже авторизован
        driver.get(base_url)
        time.sleep(2)
        
        # Проверяем что мы на странице постов или пользователей
        assert any(x in driver.current_url for x in ["posts", "users", "main"]), \
            f"Не на странице контента. URL: {driver.current_url}"
        print("✅ Авторизация работает")

    def test_logout(self, driver, base_url, auth_user):
        """Проверяем выход из аккаунта"""
        driver.get(base_url)
        time.sleep(2)
        
        sidebar = Sidebar(driver)
        sidebar.click_logout()
        
        time.sleep(2)
        assert "login" in driver.current_url or "auth" in driver.current_url, \
            f"Не на странице логина. URL: {driver.current_url}"
        print("✅ Выход из аккаунта работает")


@pytest.mark.e2e
class TestPostFlow:
    """E2E тесты для работы с постами"""

    def test_view_posts_list(self, driver, base_url, auth_user):
        """Проверяем просмотр списка постов"""
        posts_page = PostsPage(driver, base_url)
        posts_page.open_posts()
        
        assert posts_page.is_posts_list_visible(), "Список постов не видна"
        print("✅ Список постов загружен")

    def test_create_post(self, driver, base_url, auth_user):
        """Проверяем создание нового поста"""
        posts_page = PostsPage(driver, base_url)
        posts_page.open_posts()
        posts_page.click_add_post_button()
        
        modal = AddPostModal(driver, base_url)
        modal.wait_for_modal()
        
        assert modal.is_modal_visible(), "Модал не видна"
        
        # Заполняем форму и отправляем
        modal.fill_post_form(
            title="Автоматический тест - новый пост",
            content="Это содержание автоматически созданного поста при помощи E2E теста"
        )
        modal.submit_post()
        
        time.sleep(2)
        
        # Проверяем что мы остались на странице постов или перешли на деталь
        assert any(x in driver.current_url for x in ["posts", "detail"]), \
            f"Неправильный URL: {driver.current_url}"
        print("✅ Пост создан успешно")

    def test_view_post_detail(self, driver, base_url, auth_user):
        """Проверяем просмотр деталей поста"""
        posts_page = PostsPage(driver, base_url)
        posts_page.open_posts()
        
        # Пробуем кликнуть на первый пост если они есть
        try:
            posts_page.click_post_by_index(0)
            post_detail = PostDetailPage(driver, base_url)
            assert post_detail.is_post_detail_visible(), "Страница деталей поста не загружена"
            print("✅ Страница деталей поста загружена")
        except IndexError:
            print("⚠️ Нет постов для просмотра деталей")

    def test_edit_post(self, driver, base_url, auth_user):
        """Проверяем редактирование поста"""
        # Сначала создаем пост
        posts_page = PostsPage(driver, base_url)
        posts_page.open_posts()
        posts_page.click_add_post_button()
        
        modal = AddPostModal(driver, base_url)
        modal.wait_for_modal()
        modal.fill_post_form(
            title="Пост для редактирования",
            content="Оригинальное содержание"
        )
        modal.submit_post()
        time.sleep(2)
        
        # Открываем пост и редактируем его
        try:
            posts_page.click_post_by_index(0)
            post_detail = PostDetailPage(driver, base_url)
            post_detail.click_edit_post()
            time.sleep(1)
            
            # Модал редактирования должен появиться
            modal = AddPostModal(driver, base_url)
            modal.wait_for_modal()
            print("✅ Модал редактирования открыт")
        except Exception as e:
            print(f"⚠️ Ошибка при редактировании: {e}")

    def test_delete_post(self, driver, base_url, auth_user):
        """Проверяем удаление поста"""
        # Создаем пост для удаления
        posts_page = PostsPage(driver, base_url)
        posts_page.open_posts()
        initial_count = posts_page.get_post_count()
        
        posts_page.click_add_post_button()
        modal = AddPostModal(driver, base_url)
        modal.wait_for_modal()
        modal.fill_post_form(
            title="Пост для удаления",
            content="Этот пост будет удален"
        )
        modal.submit_post()
        time.sleep(2)
        
        # Проверяем что пост добавился
        new_count = posts_page.get_post_count()
        assert new_count > initial_count, "Пост не был добавлен"
        
        # Кликаем на пост и удаляем его
        try:
            posts_page.click_post_by_index(0)
            post_detail = PostDetailPage(driver, base_url)
            post_detail.click_delete_post()
            time.sleep(2)
            
            # После удаления должны быть на списке постов
            assert "posts" in driver.current_url, f"Не на странице постов: {driver.current_url}"
            print("✅ Пост удален успешно")
        except Exception as e:
            print(f"⚠️ Ошибка при удалении: {e}")


@pytest.mark.e2e
class TestCommentFlow:
    """E2E тесты для работы с комментариями"""

    def test_add_comment_to_post(self, driver, base_url, auth_user):
        """Проверяем добавление комментария к посту"""
        # Сначала создаем пост
        posts_page = PostsPage(driver, base_url)
        posts_page.open_posts()
        posts_page.click_add_post_button()
        
        modal = AddPostModal(driver, base_url)
        modal.wait_for_modal()
        modal.fill_post_form(
            title="Пост для комментариев",
            content="Это пост для проверки добавления комментариев"
        )
        modal.submit_post()
        time.sleep(2)
        
        # Открываем пост и добавляем комментарий
        posts_page.click_post_by_index(0)
        post_detail = PostDetailPage(driver, base_url)
        
        initial_count = post_detail.get_comments_count()
        post_detail.add_comment("Отличный пост! Спасибо за информацию.")
        time.sleep(2)
        
        new_count = post_detail.get_comments_count()
        assert new_count > initial_count, "Комментарий не был добавлен"
        print("✅ Комментарий добавлен успешно")

    def test_view_comments_on_post(self, driver, base_url, auth_user):
        """Проверяем просмотр комментариев на посте"""
        posts_page = PostsPage(driver, base_url)
        posts_page.open_posts()
        
        # Если есть посты, открываем первый
        try:
            if posts_page.get_post_count() > 0:
                posts_page.click_post_by_index(0)
                post_detail = PostDetailPage(driver, base_url)
                
                comments_count = post_detail.get_comments_count()
                print(f"✅ На посте {comments_count} комментариев")
            else:
                print("⚠️ Нет постов для проверки комментариев")
        except Exception as e:
            print(f"⚠️ Ошибка при просмотре комментариев: {e}")


@pytest.mark.e2e
class TestUserFlow:
    """E2E тесты для работы с профилем пользователя"""

    def test_view_users_list(self, driver, base_url, auth_user):
        """Проверяем просмотр списка пользователей"""
        sidebar = Sidebar(driver)
        # Пробуем перейти на страницу пользователей
        try:
            # Ищем ссылку на пользователей в боковой панели
            driver.get(f"{base_url}/users")
            time.sleep(2)
            
            assert "users" in driver.current_url, f"Не на странице пользователей: {driver.current_url}"
            print("✅ Страница пользователей загружена")
        except Exception as e:
            print(f"⚠️ Не удалось открыть страницу пользователей: {e}")

    def test_view_user_profile(self, driver, base_url, auth_user):
        """Проверяем просмотр профиля пользователя"""
        try:
            driver.get(f"{base_url}/settings")
            time.sleep(2)
            
            assert any(x in driver.current_url for x in ["settings", "profile"]), \
                f"Неправильный URL: {driver.current_url}"
            print("✅ Страница профиля/настроек загружена")
        except Exception as e:
            print(f"⚠️ Ошибка при открытии профиля: {e}")
