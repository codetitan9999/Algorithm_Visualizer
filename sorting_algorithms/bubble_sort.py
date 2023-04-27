import pygame, sys, random, time

from pygame_utilities import *

# setup

pygame.init()
screen = pygame.display.set_mode((WIDTH, HEIGHT))
clear_screen(screen)


# input items
# TODO: take the below as inputs

arr_size = 15
bar_width = 30
space = 10
speed = .5


# inital state
arr = []




# bubble_sort algorithm

def bubble_sort():
    '''
    Sorts the arr and updates the display at every swap
    '''

    for i in range(arr_size):
        for j in range(arr_size - i - 1):

            for k in range(arr_size):
                is_compared = k in (j, j + 1)
                draw_bar(k, is_compared)

            pygame.display.update()
            time.sleep(speed)

            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]

            clear_screen(screen)

            for k in range(arr_size):
                is_compared = k in (j, j + 1)
                draw_bar(k, is_compared)

            pygame.display.update()
            time.sleep(speed)



# drawing funcs
                        
def draw_bar(ind, is_compared):
    '''
    Draws a single bar. arr[ind] * 10 is taken as the height of the bar (for better display)
    The x, y coords are determined using ind and arr[ind]
    is_compared: if true draws a orange bar else a green bar
    '''

    bar_height = arr[ind] * 10
    color = [BLUE, ORANGE][is_compared]

    x = ind * (bar_width + space) + (WIDTH - (arr_size * (bar_width + space))) / 2
    y = HEIGHT / 2 - bar_height

    pygame.draw.rect(screen, color, (x, y, bar_width, bar_height), 0)
    msg = str(arr[ind])
    myfont = pygame.font.SysFont(msg, 25)
    text = myfont.render(msg, True, (0, 0, 0))
    screen.blit(text, (x, y + bar_height + 20))


def draw_all_bars():

    '''
    Draws bar representation for all the values in the arr.
    All bars have the same color.
    '''

    for i in range(arr_size):
        draw_bar(i, False)



# random arr creation

def create_arr():
    '''
    Creates a random array with values in the range of 1 to 15
    '''

    for i in range(arr_size):
        height = random.randint(1, 15)
        arr.append(height)



if __name__ == '__main__':

    while True:
        is_clicked = button(screen, 'Sort', WIDTH / 2 - 60, HEIGHT / 2 - 50, 80, 50, BLUE, ORANGE)
        pygame.display.update()

        if is_clicked:
            break
        
        check_exit()
        

    clear_screen(screen)
    create_arr()
    draw_all_bars()
    bubble_sort()


    while True:
        check_exit()
