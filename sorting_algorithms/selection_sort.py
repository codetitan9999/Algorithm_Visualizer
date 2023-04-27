import pygame
import sys
import random
import time

from pygame_utilities import *

arr_size = 15
bar_width = 30
space = 10
speed = .9
state = []
arr = []


for i in range(arr_size):
    height = random.randint(1, arr_size)
    arr.append(height)
    state.append(1)


pygame.init()
window = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption('Selection Sort')

# --------------------------------------


def draw_bar(ind, col):
    '''
    col - color of bar wrt status of that index
    Draws a single bar. arr[ind] * 10 is taken as the height of the bar (for better display)
    The x, y coords are determined using ind and arr[ind]

    '''

    bar_height = arr[ind] * 10

    x = ind*(bar_width+space) + (WIDTH - (arr_size * (bar_width + space)))/2
    y = HEIGHT/2 - bar_height
    pygame.draw.rect(window, col, (x, y, bar_width, bar_height), 0)
    msg = str(arr[ind])
    myfont = pygame.font.SysFont(msg, 25)
    text = myfont.render(msg, True, (0, 0, 0))
    window.blit(text, (x, y + bar_height + 20))


def displayArr(state):
    '''
      displays the array values as bars
      state - An array that states the color of every element in color
    '''

    for i in range(arr_size):
        if state[i] == 0:
            color = (255, 0, 0)  # red
        elif state[i] == 2:
            color = (255, 255, 0)
        elif state[i] == 3:
            color = (0, 0, 0)
        elif state[i] == 4:
            color = (0, 255, 0)  # green
        else:
            color = (0, 0, 255)  # blue

        draw_bar(i, color)

    pygame.display.update()
    time.sleep(speed)

# -------------------------------------------


def selectionSort(itemsList):
    '''
       sorts the array with selction-sort technique
    '''
    n = len(itemsList)
    for counter in range(n):
        minValueIndex = counter
        state[counter] = 2
        for j in range(counter + 1, n):
            state[j] = 0
            displayArr(state)
            clear_screen(window)
            state[j] = 1
            if itemsList[j] < itemsList[minValueIndex]:
                # changing the state value - as indication of minvalue
                state[j] = 3
                if minValueIndex != counter:
                    state[minValueIndex] = 1
                minValueIndex = j

                displayArr(state)
                clear_screen(window)
                # state[j] = 3 # change state of  previous minvalue index

        # swaps - minimum value and counter

        itemsList[counter], itemsList[minValueIndex] = itemsList[minValueIndex], itemsList[counter]

        state[minValueIndex] = 1

        # finished - status
        if counter < n:
            state[counter] = 4

        displayArr(state)
        clear_screen(window)


# ---------------------------------------'
# Driver code
if __name__ == "__main__":
    running = True
    while running:
        is_clicked = button(window, 'Sort', WIDTH / 2 - 60,
                            HEIGHT / 2 - 50, 80, 50, BLUE, ORANGE)
        pygame.display.update()

        if is_clicked:
            break

        check_exit()

    clear_screen(window)

    displayArr(state)
    selectionSort(arr)

    while True:
        check_exit()
