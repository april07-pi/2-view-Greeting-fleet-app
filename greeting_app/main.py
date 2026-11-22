import flet as ft


def main(page: ft.Page):
    page.title = "Two-View Greeting App"
    page.window.width = 480
    page.window.height = 640

    # Shared variable inside main so both views can access the entered name
    user_name = ""

    name_field = ft.TextField(
        label="Your Name",
        hint_text="Enter your name",
        width=320,
        autofocus=True,
    )

    def close_dialog(e: ft.ControlEvent):
        page.pop_dialog()

    empty_name_dialog = ft.AlertDialog(
        modal=True,
        title=ft.Text("Name Required"),
        content=ft.Text("Please enter your name before continuing."),
        actions=[
            ft.TextButton("OK", on_click=close_dialog),
        ],
        actions_alignment=ft.MainAxisAlignment.END,
    )

    async def continue_clicked(e: ft.ControlEvent):
        nonlocal user_name
        entered = (name_field.value or "").strip()
        if not entered:
            page.show_dialog(empty_name_dialog)
            return

        user_name = entered
        await page.push_route("/greeting")

    async def back_clicked(e: ft.ControlEvent):
        await page.push_route("/")

    def route_change(e: ft.RouteChangeEvent | None = None):
        page.views.clear()

        home_view = ft.View(
            route="/",
            vertical_alignment=ft.MainAxisAlignment.CENTER,
            horizontal_alignment=ft.CrossAxisAlignment.CENTER,
            controls=[
                ft.Text(
                    "Two-View Greeting App",
                    size=28,
                    weight=ft.FontWeight.BOLD,
                ),
                ft.Text(
                    "Enter your name to receive a personalized greeting.",
                    size=14,
                    color=ft.Colors.ON_SURFACE_VARIANT,
                ),
                name_field,
                ft.Button(
                    content="Continue",
                    width=320,
                    on_click=continue_clicked,
                ),
            ],
        )
        page.views.append(home_view)

        if page.route == "/greeting":
            greeting_view = ft.View(
                route="/greeting",
                vertical_alignment=ft.MainAxisAlignment.CENTER,
                horizontal_alignment=ft.CrossAxisAlignment.CENTER,
                controls=[
                    ft.Text(
                        f"Hello, {user_name}!",
                        size=32,
                        weight=ft.FontWeight.BOLD,
                    ),
                    ft.Button(
                        content="Back",
                        width=180,
                        on_click=back_clicked,
                    ),
                ],
            )
            page.views.append(greeting_view)

        page.update()

    async def view_pop(e: ft.ViewPopEvent):
        if len(page.views) > 1:
            page.views.pop()
            top_view = page.views[-1]
            await page.push_route(top_view.route)

    page.on_route_change = route_change
    page.on_view_pop = view_pop
    route_change()


ft.run(main)
