from pathlib import Path
from openpyxl import Workbook

HEADERS = [
    "CaseID", "Feature", "Scenario", "Preconditions", "Steps", "ExpectedResult",
    "Data_MovieID", "Data_Email", "Data_Password", "Data_User_FullName", 
    "Data_Rating", "Data_Comment", "AssertType", "ExpectedUIMessage",
]

MOVIE_ID = "05705299-3003-464c-8dc3-d6d8ff7d9905"
VALID_EMAIL = "charosnguyen666@gmail.com"
VALID_PASS = "WV_bF94S"
# SỬA LỖI (REV-011): Đổi tên cho khớp với UI
VALID_FULLNAME = "Nguyen Charos" 

CASES = [
    # Kịch bản 1: Người dùng khách (Chưa đăng nhập) - 5 Cases (PASS)
    {
        "CaseID": "REV-001", "Feature": "Movie Review", "Scenario": "Guest views review form",
        "Preconditions": "User not logged in", "Steps": f"Open /movie/{MOVIE_ID}; Scroll to 'Audience Reviews'",
        "ExpectedResult": "Form đánh giá bị ẩn; Nút 'Sign in to review' hiển thị",
        "Data_MovieID": MOVIE_ID, "AssertType": "review_form_hidden", "ExpectedUIMessage": "Sign in to review",
    },
    {
        "CaseID": "REV-002", "Feature": "Movie Review", "Scenario": "Guest clicks 'Sign in to review'",
        "Preconditions": "User not logged in", "Steps": f"Open /movie/{MOVIE_ID}; Scroll to 'Audience Reviews'; Click 'Sign in to review'",
        "ExpectedResult": "Người dùng được chuyển hướng đến trang /login",
        "Data_MovieID": MOVIE_ID, "AssertType": "redirect_to_login", "ExpectedUIMessage": "/login",
    },
    {
        "CaseID": "REV-003", "Feature": "Movie Review", "Scenario": "Guest can see existing reviews",
        "Preconditions": "User not logged in; Movie has reviews", "Steps": f"Open /movie/{MOVIE_ID}; Scroll to 'Audience Reviews'",
        "ExpectedResult": "Danh sách đánh giá của người khác hiển thị; Không có nút 'Remove'",
        "Data_MovieID": MOVIE_ID, "AssertType": "review_list_visible",
    },
    {
        "CaseID": "REV-019", "Feature": "Movie Review", "Scenario": "Guest - Load more reviews (pagination)",
        "Preconditions": "Movie has > 5 reviews", "Steps": f"Open /movie/{MOVIE_ID}; Scroll to bottom; Click 'Load more reviews'",
        "ExpectedResult": "Các đánh giá mới được tải và hiển thị thêm",
        "Data_MovieID": MOVIE_ID, "AssertType": "review_pagination_success",
    },
    {
        "CaseID": "REV-020", "Feature": "Movie Review", "Scenario": "Guest - Verify total review count and average score",
        "Preconditions": "Movie has 12 reviews; avg 8.3", "Steps": f"Open /movie/{MOVIE_ID}; Observe Hero section",
        "ExpectedResult": "Hero hiển thị '8.3 / 10'",
        "Data_MovieID": MOVIE_ID, "AssertType": "review_hero_check",
        "ExpectedUIMessage": "8.3 / 10", 
    },

    # Kịch bản 2: Gửi Review (4 PASS, 3 FAIL)
    {
        "CaseID": "REV-007", "Feature": "Movie Review", "Scenario": "Submit review with no rating (Negative Test)",
        "Preconditions": "User logged in; No prior review", "Steps": f"Login as {VALID_EMAIL}; Open /movie/{MOVIE_ID}; Select 0 stars; Enter 'Phim cũng được'; Click 'Post Review'",
        "ExpectedResult": "Hiển thị thông báo lỗi; Đánh giá không được gửi",
        "Data_MovieID": MOVIE_ID, "Data_Email": VALID_EMAIL, "Data_Password": VALID_PASS, "Data_User_FullName": VALID_FULLNAME,
        "Data_Rating": 0, "Data_Comment": "Phim cũng được",
        "AssertType": "ui_error_message", "ExpectedUIMessage": "Please select a rating before submitting.",
    },
    
    # --- 3 TEST CASE NEGATIVE - Kiểm tra validation comment ---
    {
        "CaseID": "REV-008", "Feature": "Movie Review", "Scenario": "FAIL - Submit review with short comment (2 chars)",
        "Preconditions": "User logged in; No prior review", "Steps": f"Login as {VALID_EMAIL}; Open /movie/{MOVIE_ID}; Select 7 stars; Enter 'Ok'; Click 'Post Review'",
        "ExpectedResult": "Hiển thị lỗi validation: comment quá ngắn",
        "Data_MovieID": MOVIE_ID, "Data_Email": VALID_EMAIL, "Data_Password": VALID_PASS, "Data_User_FullName": VALID_FULLNAME,
        "Data_Rating": 7, "Data_Comment": "Ok",
        "AssertType": "ui_error_message", 
        "ExpectedUIMessage": "Please share a few words about the movie (min 3 characters).", 
    },
    {
        "CaseID": "REV-009", "Feature": "Movie Review", "Scenario": "FAIL - Submit review with whitespace comment",
        "Preconditions": "User logged in; No prior review", "Steps": f"Login as {VALID_EMAIL}; Open /movie/{MOVIE_ID}; Select 5 stars; Enter '     '; Click 'Post Review'",
        "ExpectedResult": "Hiển thị lỗi validation: comment chỉ có khoảng trắng",
        "Data_MovieID": MOVIE_ID, "Data_Email": VALID_EMAIL, "Data_Password": VALID_PASS, "Data_User_FullName": VALID_FULLNAME,
        "Data_Rating": 5, "Data_Comment": "     ",
        "AssertType": "ui_error_message", 
        "ExpectedUIMessage": "Please share a few words about the movie (min 3 characters).", 
    },
    {
        "CaseID": "REV-010", "Feature": "Movie Review", "Scenario": "FAIL - Submit review with empty comment",
        "Preconditions": "User logged in; No prior review", "Steps": f"Login as {VALID_EMAIL}; Open /movie/{MOVIE_ID}; Select 6 stars; Leave comment blank; Click 'Post Review'",
        "ExpectedResult": "Hiển thị lỗi validation: comment trống",
        "Data_MovieID": MOVIE_ID, "Data_Email": VALID_EMAIL, "Data_Password": VALID_PASS, "Data_User_FullName": VALID_FULLNAME,
        "Data_Rating": 6, "Data_Comment": "",
        "AssertType": "ui_error_message", 
        "ExpectedUIMessage": "Please share a few words about the movie (min 3 characters).", 
    },
    # --- HẾT 3 CASE NEGATIVE ---

    {
        "CaseID": "REV-004", "Feature": "Movie Review", "Scenario": "Submit valid review (8 stars, long comment)",
        "Preconditions": "User logged in; No prior review for this movie", "Steps": f"Login as {VALID_EMAIL}; Open /movie/{MOVIE_ID}; Select 8 stars; Enter 'Phim này có kỹ xảo thật tuyệt vời, rất đáng xem!'; Click 'Post Review'",
        "ExpectedResult": "Thông báo thành công; Form ẩn đi; Đánh giá mới xuất hiện đầu danh sách",
        "Data_MovieID": MOVIE_ID, "Data_Email": VALID_EMAIL, "Data_Password": VALID_PASS, "Data_User_FullName": VALID_FULLNAME,
        "Data_Rating": 8, "Data_Comment": "Phim này có kỹ xảo thật tuyệt vời, rất đáng xem!",
        "AssertType": "review_submit_success", "ExpectedUIMessage": "You already reviewed this movie.",
    },
    {
        "CaseID": "REV-005", "Feature": "Movie Review", "Scenario": "Submit valid review (min comment length 3 chars)",
        "Preconditions": "User logged in; No prior review", "Steps": f"Login as {VALID_EMAIL}; Open /movie/{MOVIE_ID}; Select 5 stars; Enter 'Hay'; Click 'Post Review'",
        "ExpectedResult": "Đánh giá được gửi thành công",
        "Data_MovieID": MOVIE_ID, "Data_Email": VALID_EMAIL, "Data_Password": VALID_PASS, "Data_User_FullName": VALID_FULLNAME,
        "Data_Rating": 5, "Data_Comment": "Hay",
        "AssertType": "review_submit_success", "ExpectedUIMessage": "You already reviewed this movie.",
    },
    {
        "CaseID": "REV-006", "Feature": "Movie Review", "Scenario": "Submit valid review (special chars)",
        "Preconditions": "User logged in; No prior review", 
        "Steps": f"Login as {VALID_EMAIL}; Open /movie/{MOVIE_ID}; Select 10 stars; Enter 'Tuyệt vời 10/10 !!!'; Click 'Post Review'",
        "ExpectedResult": "Đánh giá được gửi thành công",
        "Data_MovieID": MOVIE_ID, "Data_Email": VALID_EMAIL, "Data_Password": VALID_PASS, "Data_User_FullName": VALID_FULLNAME,
        "Data_Rating": 10, "Data_Comment": "Tuyệt vời 10/10 !!!", # Đã bỏ emoji
        "AssertType": "review_submit_success", "ExpectedUIMessage": "You already reviewed this movie.",
    },

    # Kịch bản 3: Quản lý Review (Đã có review) - 5 Cases (PASS)
    {
        "CaseID": "REV-011", "Feature": "Movie Review", "Scenario": "View own review (displays first)",
        "Preconditions": "User logged in; HAS existing review", "Steps": f"Login as {VALID_EMAIL}; Open /movie/{MOVIE_ID}; Scroll to reviews",
        "ExpectedResult": "Đánh giá của user_A hiển thị ở đầu danh sách",
        "Data_MovieID": MOVIE_ID, "Data_Email": VALID_EMAIL, "Data_Password": VALID_PASS, "Data_User_FullName": VALID_FULLNAME,
        "AssertType": "review_self_on_top",
    },
    {
        "CaseID": "REV-012", "Feature": "Movie Review", "Scenario": "Review form is hidden after reviewing",
        "Preconditions": "User logged in; HAS existing review", "Steps": f"Login as {VALID_EMAIL}; Open /movie/{MOVIE_ID}; Scroll to reviews",
        "ExpectedResult": "Form đánh giá bị ẩn; Hiển thị thông báo 'You already reviewed...'",
        "Data_MovieID": MOVIE_ID, "Data_Email": VALID_EMAIL, "Data_Password": VALID_PASS, "Data_User_FullName": VALID_FULLNAME,
        "AssertType": "review_form_hidden", "ExpectedUIMessage": "You already reviewed this movie.",
    },
    {
        "CaseID": "REV-013", "Feature": "Movie Review", "Scenario": "'Remove review' button is visible on own review",
        "Preconditions": "User logged in; HAS existing review", "Steps": f"Login as {VALID_EMAIL}; Open /movie/{MOVIE_ID}; Scroll to own review",
        "ExpectedResult": "Nút 'Remove review' hiển thị trên đánh giá của user_A",
        "Data_MovieID": MOVIE_ID, "Data_Email": VALID_EMAIL, "Data_Password": VALID_PASS, "Data_User_FullName": VALID_FULLNAME,
        "AssertType": "review_remove_visible",
    },
    {
        "CaseID": "REV-014", "Feature": "Movie Review", "Scenario": "Remove review from Movie Detail Page",
        "Preconditions": "User logged in; HAS existing review", "Steps": f"Login as {VALID_EMAIL}; Open /movie/{MOVIE_ID}; Click 'Remove review'",
        "ExpectedResult": "Đánh giá biến mất; Form đánh giá xuất hiện trở lại",
        "Data_MovieID": MOVIE_ID, "Data_Email": VALID_EMAIL, "Data_Password": VALID_PASS, "Data_User_FullName": VALID_FULLNAME,
        "AssertType": "review_remove_success",
    },
    {
        "CaseID": "REV-015", "Feature": "Movie Review", "Scenario": "Submit new review after deleting old one",
        "Preconditions": "User just completed REV-014", "Steps": f"On same page; Select 3 stars; Enter 'Xem lại thấy cũng bình thường.'; Click 'Post Review'",
        "ExpectedResult": "Đánh giá mới (3 sao) được gửi thành công",
        "Data_MovieID": MOVIE_ID, "Data_Email": VALID_EMAIL, "Data_Password": VALID_PASS, "Data_User_FullName": VALID_FULLNAME,
        "Data_Rating": 3, "Data_Comment": "Xem lại thấy cũng bình thường.",
        "AssertType": "review_submit_success", "ExpectedUIMessage": "You already reviewed this movie.",
    },

    # Kịch bản 4: Trang "Đánh giá của tôi" (/profile/reviews) - 3 Cases (PASS)
    {
        "CaseID": "REV-016", "Feature": "My Reviews Page", "Scenario": "Review appears on /profile/reviews",
        "Preconditions": "User logged in; Has existing review (from REV-015)", "Steps": f"Login as {VALID_EMAIL}; Navigate to /profile/reviews",
        "ExpectedResult": "Đánh giá (3 sao, 'Xem lại...') hiển thị trong danh sách",
        "Data_MovieID": MOVIE_ID, "Data_Email": VALID_EMAIL, "Data_Password": VALID_PASS, "Data_User_FullName": VALID_FULLNAME,
        "Data_Comment": "Xem lại thấy cũng bình thường.", "AssertType": "review_list_updated",
    },
    {
        "CaseID": "REV-017", "Feature": "My Reviews Page", "Scenario": "Remove review from /profile/reviews",
        "Preconditions": "User logged in; Has existing review (from REV-015)", "Steps": f"Login as {VALID_EMAIL}; Navigate to /profile/reviews; Find review; Click 'Remove rating'",
        "ExpectedResult": "Đánh giá biến mất khỏi danh sách /profile/reviews",
        "Data_MovieID": MOVIE_ID, "Data_Email": VALID_EMAIL, "Data_Password": VALID_PASS, "Data_User_FullName": VALID_FULLNAME,
        "Data_Comment": "Xem lại thấy cũng bình thường.", "AssertType": "review_remove_success_profile",
        "ExpectedUIMessage": "Your review has been removed.", 
    },
    {
        "CaseID": "REV-018", "Feature": "Movie Review", "Scenario": "Check sync after deleting from My Reviews",
        "Preconditions": "User just completed REV-017", "Steps": f"Login as {VALID_EMAIL}; Navigate back to /movie/{MOVIE_ID}",
        "ExpectedResult": "Form đánh giá (sao và bình luận) hiển thị trở lại",
        "Data_MovieID": MOVIE_ID, "Data_Email": VALID_EMAIL, "Data_Password": VALID_PASS, "Data_User_FullName": VALID_FULLNAME,
        "AssertType": "review_form_visible",
    },
]

OUTPUT_PATH = Path(__file__).with_name("review_test_cases.xlsx")

def main() -> None:
    wb = Workbook()
    ws = wb.active
    ws.title = "ReviewCases"
    ws.append(HEADERS)
    for row in CASES:
        ws.append([row.get(column, "") for column in HEADERS])
    for column_cells in ws.columns:
        max_length = max(len(str(cell.value)) if cell.value else 0 for cell in column_cells)
        adjusted_width = max_length + 4
        ws.column_dimensions[column_cells[0].column_letter].width = adjusted_width
    wb.save(OUTPUT_PATH)
    print(f"Đã tạo file test case tại: {OUTPUT_PATH}")

if __name__ == "__main__":
    main()