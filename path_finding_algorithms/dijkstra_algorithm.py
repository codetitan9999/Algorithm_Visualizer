import pygame
import math
from queue import PriorityQueue
from spot import *
from pygame_utilities import *

# set up

pygame.init()
screen = pygame.display.set_mode((WIDTH, WIDTH))
clear_screen(screen)

# input items

ROWS = 50


# algorithm

def dijkstras_algorithm(grid, start, end):
    '''
    Implements the dijkstra's path finding algorithm between the start and end in the given grid
    '''
    open_set = PriorityQueue(
    )  # the spots that are yet to be explored, with their distance from start
    open_set.put((0, start))  # the dist is used to build the heap
    parent = {}  # contains the parent of the spot in the shortest path
    # the distance from start
    dist = {spot: float("inf") for row in grid for spot in row}
    dist[start] = 0

    open_set_hash = {start}  # the spots that are yet to explored

    while not open_set.empty():
        clear_screen(screen)

        current = open_set.get()[1]
        open_set_hash.remove(current)

        if current == end:
            reconstruct_path(parent, end)
            end.make_path()
            return

        for neighbor in current.neighbors:
            temp_dist = dist[current] + 1

            if temp_dist < dist[neighbor]:
                parent[neighbor] = current
                dist[neighbor] = temp_dist
                if neighbor not in open_set_hash:
                    open_set.put((dist[neighbor], neighbor))
                    open_set_hash.add(neighbor)
                    neighbor.make_open()

        draw(screen, grid, ROWS, WIDTH)

        if current != start:
            current.make_closed()


# drawing functions

def draw_grid(screen, rows, width):
    '''
    Draws the lines in the grid
    '''
    gap = width // rows
    for i in range(rows):
        pygame.draw.line(screen, GREY, (0, i * gap), (width, i * gap))
        for j in range(rows):
            pygame.draw.line(screen, GREY, (j * gap, 0), (j * gap, width))


def draw(screen, grid, rows, width):
    '''
    Draws the spots with their colors and lines of the grid
    '''
    clear_screen(screen)

    for row in grid:
        for spot in row:
            spot.draw(screen)  # draws the spots, with it's color

    draw_grid(screen, rows, width)
    pygame.display.update()


def reconstruct_path(parent, current):
    '''
    Changes the colors of the spots in the shortest path obtained
    '''
    # the loop runs while current has a parent
    #  only start has no parent, so the loop breaks at start
    while current in parent:
        current = parent[current]
        current.make_path()
    # once we update the colors, we reflect them in the display
    draw(screen, grid, ROWS, WIDTH)


# --

def get_clicked_indices(pos, rows, width):
    '''
    Returns the indices of position where the mouse has been clicked
    '''
    gap = width // rows
    y, x = pos

    row = y // gap
    col = x // gap

    return row, col


def create_grid(rows, width):
    '''
    Initializes the grid list with spots 
    '''
    grid = []
    gap = width // rows
    for i in range(rows):
        grid.append([])
        for j in range(rows):
            spot = Spot(i, j, gap, rows)
            grid[i].append(spot)

    return grid


if __name__ == '__main__':
    grid = create_grid(ROWS, WIDTH)

    start = None
    end = None

    while True:
        is_clicked = button(screen, 'Start', WIDTH / 2 - 60,
                            HEIGHT / 2 + 50, 90, 50, BLUE, ORANGE)
        pygame.display.update()

        if is_clicked:
            break

        check_exit()

    while True:
        draw(screen, grid, ROWS, WIDTH)
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                pygame.quit()
                exit()

            # draw start, end, block spots on mouse press
            if pygame.mouse.get_pressed()[0]:
                pos = pygame.mouse.get_pos()
                row, col = get_clicked_indices(pos, ROWS, WIDTH)
                spot = grid[row][col]
                if not start and spot != end:
                    start = spot
                    start.make_start()

                elif not end and spot != start:
                    end = spot
                    end.make_end()

                elif spot != end and spot != start:
                    spot.make_barrier()

            if event.type == pygame.KEYDOWN:
                if event.key == pygame.K_SPACE and start and end:
                    for row in grid:
                        for spot in row:
                            spot.update_neighbors(grid)

                    dijkstras_algorithm(grid, start, end)
