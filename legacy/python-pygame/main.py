from __future__ import annotations

import subprocess
import sys
from dataclasses import dataclass
from pathlib import Path

import pygame


ROOT = Path(__file__).resolve().parent
WINDOW_WIDTH = 1180
WINDOW_HEIGHT = 760
CARD_WIDTH = 320
CARD_HEIGHT = 170
CARD_GAP = 28

BACKGROUND = (244, 236, 223)
SURFACE = (255, 251, 245)
TEXT = (36, 28, 21)
MUTED = (101, 80, 65)
SHADOW = (154, 132, 114)
ACCENT = (200, 92, 52)
SORTING_ACCENT = (48, 102, 179)
PATH_ACCENT = (50, 140, 106)
CARD_COLORS = {
    "Sorting": (232, 240, 252),
    "Pathfinding": (231, 246, 239),
}


@dataclass(frozen=True)
class Demo:
    title: str
    category: str
    script: str
    description: str


DEMOS = [
    Demo(
        title="Bubble Sort",
        category="Sorting",
        script="sorting_algorithms/bubble_sort.py",
        description="Step through adjacent swaps and watch the list settle into order.",
    ),
    Demo(
        title="Insertion Sort",
        category="Sorting",
        script="sorting_algorithms/insertion_sort.py",
        description="Grow a sorted prefix one bar at a time while values slide into place.",
    ),
    Demo(
        title="Selection Sort",
        category="Sorting",
        script="sorting_algorithms/selection_sort.py",
        description="Scan for the minimum value each round and move it into the next slot.",
    ),
    Demo(
        title="Merge Sort",
        category="Sorting",
        script="sorting_algorithms/merge_sort.py",
        description="Visualize divide-and-conquer merging with a fresh randomized array.",
    ),
    Demo(
        title="Quick Sort",
        category="Sorting",
        script="sorting_algorithms/quick_sort.py",
        description="Partition the array around pivots and watch the recursion take shape.",
    ),
    Demo(
        title="A* Search",
        category="Pathfinding",
        script="path_finding_algorithms/astar_algorithm.py",
        description="Compare informed search behavior while routing around barriers.",
    ),
    Demo(
        title="Dijkstra",
        category="Pathfinding",
        script="path_finding_algorithms/dijkstra_algorithm.py",
        description="Explore shortest paths uniformly and see every expansion unfold.",
    ),
]


def create_fonts() -> dict[str, pygame.font.Font]:
    return {
        "hero": pygame.font.SysFont("georgia", 48, bold=True),
        "subtitle": pygame.font.SysFont("arial", 22),
        "card_title": pygame.font.SysFont("arial", 28, bold=True),
        "card_text": pygame.font.SysFont("arial", 18),
        "badge": pygame.font.SysFont("arial", 16, bold=True),
        "footer": pygame.font.SysFont("arial", 18),
    }


def draw_wrapped_text(
    screen: pygame.Surface,
    text: str,
    font: pygame.font.Font,
    color: tuple[int, int, int],
    x: int,
    y: int,
    max_width: int,
    line_spacing: int = 6,
) -> None:
    words = text.split()
    lines: list[str] = []
    current_line: list[str] = []

    for word in words:
        candidate = " ".join(current_line + [word])
        if font.size(candidate)[0] <= max_width:
            current_line.append(word)
        else:
            if current_line:
                lines.append(" ".join(current_line))
            current_line = [word]

    if current_line:
        lines.append(" ".join(current_line))

    for index, line in enumerate(lines):
        rendered = font.render(line, True, color)
        screen.blit(rendered, (x, y + index * (font.get_height() + line_spacing)))


def card_rect(index: int) -> pygame.Rect:
    row = index // 3
    col = index % 3
    x = 70 + col * (CARD_WIDTH + CARD_GAP)
    y = 210 + row * (CARD_HEIGHT + CARD_GAP)
    return pygame.Rect(x, y, CARD_WIDTH, CARD_HEIGHT)


def run_demo(demo: Demo) -> None:
    pygame.quit()
    subprocess.run([sys.executable, demo.script], cwd=ROOT, check=False)


def draw_background(screen: pygame.Surface) -> None:
    screen.fill(BACKGROUND)
    pygame.draw.circle(screen, (255, 227, 205), (140, 120), 120)
    pygame.draw.circle(screen, (226, 240, 255), (1040, 100), 150)
    pygame.draw.circle(screen, (223, 243, 231), (980, 650), 180)
    pygame.draw.rect(screen, SURFACE, (32, 26, WINDOW_WIDTH - 64, WINDOW_HEIGHT - 52), border_radius=28)


def draw_card(
    screen: pygame.Surface,
    fonts: dict[str, pygame.font.Font],
    demo: Demo,
    rect: pygame.Rect,
    hovered: bool,
) -> pygame.Rect:
    shadow_offset = 12 if hovered else 8
    shadow_rect = rect.move(0, shadow_offset)
    pygame.draw.rect(screen, SHADOW, shadow_rect, border_radius=24)

    fill_color = CARD_COLORS[demo.category]
    border_color = SORTING_ACCENT if demo.category == "Sorting" else PATH_ACCENT
    pygame.draw.rect(screen, fill_color, rect, border_radius=24)
    pygame.draw.rect(screen, border_color, rect, width=4 if hovered else 3, border_radius=24)

    badge_rect = pygame.Rect(rect.x + 20, rect.y + 18, 112, 32)
    pygame.draw.rect(screen, border_color, badge_rect, border_radius=16)
    badge = fonts["badge"].render(demo.category.upper(), True, SURFACE)
    badge_x = badge_rect.x + (badge_rect.width - badge.get_width()) / 2
    badge_y = badge_rect.y + (badge_rect.height - badge.get_height()) / 2
    screen.blit(badge, (badge_x, badge_y))

    title = fonts["card_title"].render(demo.title, True, TEXT)
    screen.blit(title, (rect.x + 20, rect.y + 64))
    draw_wrapped_text(
        screen,
        demo.description,
        fonts["card_text"],
        MUTED,
        rect.x + 20,
        rect.y + 102,
        rect.width - 40,
    )

    return rect


def main() -> None:
    while True:
        pygame.init()
        screen = pygame.display.set_mode((WINDOW_WIDTH, WINDOW_HEIGHT))
        pygame.display.set_caption("Algorithm Visualizer")
        clock = pygame.time.Clock()
        fonts = create_fonts()

        selection: Demo | None = None
        running = True

        while running:
            mouse_pos = pygame.mouse.get_pos()

            for event in pygame.event.get():
                if event.type == pygame.QUIT:
                    pygame.quit()
                    return

                if event.type == pygame.MOUSEBUTTONDOWN and event.button == 1:
                    for index, demo in enumerate(DEMOS):
                        if card_rect(index).collidepoint(mouse_pos):
                            selection = demo
                            running = False
                            break

            draw_background(screen)

            hero = fonts["hero"].render("Algorithm Visualizer", True, TEXT)
            screen.blit(hero, (72, 60))

            subtitle = (
                "Launch your classic demos from one place, compare algorithm families, "
                "and keep iterating on the project from a cleaner starting point."
            )
            draw_wrapped_text(screen, subtitle, fonts["subtitle"], MUTED, 72, 122, 900)

            hint = fonts["footer"].render(
                "Click any card to open that demo. Close the demo window to return here.",
                True,
                ACCENT,
            )
            screen.blit(hint, (72, 170))

            for index, demo in enumerate(DEMOS):
                hovered = card_rect(index).collidepoint(mouse_pos)
                draw_card(screen, fonts, demo, card_rect(index), hovered)

            footer = fonts["footer"].render(
                "Sorting and pathfinding demos currently run as individual Pygame scripts.",
                True,
                MUTED,
            )
            screen.blit(footer, (72, WINDOW_HEIGHT - 72))

            pygame.display.flip()
            clock.tick(60)

        if selection is None:
            pygame.quit()
            return

        run_demo(selection)


if __name__ == "__main__":
    main()
