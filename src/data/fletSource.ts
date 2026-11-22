export const MAIN_PY_SOURCE = `import flet as ft


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


ft.run(main)`;

export const REQUIREMENTS_TXT_SOURCE = `flet>=0.80.0\n`;

export interface RequirementItem {
  id: string;
  title: string;
  detail: string;
  lines: [number, number];
  codeHint: string;
}

export const ASSIGNMENT_REQUIREMENTS: RequirementItem[] = [
  {
    id: 'home-view',
    title: 'Home view (/) controls',
    detail: 'Title Text, TextField for the user’s name, and Continue Button inside ft.View(route="/").',
    lines: [47, 71],
    codeHint: 'ft.View(route="/", ...)',
  },
  {
    id: 'async-push-route',
    title: 'Async Continue handler & push_route',
    detail: 'Click handler declared as async def and navigates with await page.push_route("/greeting").',
    lines: [32, 41],
    codeHint: 'async def continue_clicked(e): ... await page.push_route("/greeting")',
  },
  {
    id: 'greeting-view',
    title: 'Greeting view (/greeting) controls',
    detail: 'Displays Text saying "Hello, <name>!" and a Back Button that returns to /.',
    lines: [73, 93],
    codeHint: 'f"Hello, {user_name}!" + Back ft.Button',
  },
  {
    id: 'shared-variable',
    title: 'Shared name variable inside main',
    detail: 'Entered name is stored in user_name inside main so both views read the same value.',
    lines: [9, 10],
    codeHint: 'user_name = "" / nonlocal user_name',
  },
  {
    id: 'empty-alert',
    title: 'Empty-name AlertDialog via page.show_dialog',
    detail: 'Prevents navigation and calls page.show_dialog(empty_name_dialog) when name is blank.',
    lines: [22, 37],
    codeHint: 'page.show_dialog(empty_name_dialog)',
  },
  {
    id: 'route-change-run',
    title: 'Route switching & ft.run(main)',
    detail: 'Uses page.on_route_change with ft.View per route and starts the app via ft.run(main).',
    lines: [97, 111],
    codeHint: 'page.on_route_change = route_change ... ft.run(main)',
  },
];
