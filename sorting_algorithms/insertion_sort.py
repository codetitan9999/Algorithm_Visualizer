#importing required modules for the program

import pygame, random, sys, time

from pygame_utilities import *

ARR_SIZE=15
BAR_WIDTH=30
SPACE=10
SPEED=.9
STATE=[]
ARR=[]

for i in range(ARR_SIZE):
    height = random.randint(1, ARR_SIZE)
    ARR.append(height)
    STATE.append(1)

pygame.init()
window=pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("INSERTION SORT")


def draw_bar(ind, col):

    '''
    col - color of bar wrt status of that index

    Draws a single bar. arr[ind] * 10 is taken as the height of the bar (for better display)

    The x, y coords are determined using ind and arr[ind]

    '''
    bar_height=ARR[ind]*10
    x=ind*(BAR_WIDTH + SPACE) + (WIDTH -(ARR_SIZE * (BAR_WIDTH + SPACE)))/2
    y=HEIGHT/2 - bar_height
    pygame.draw.rect(window, col, (x, y, BAR_WIDTH, bar_height), 0)
    msg=str(ARR[ind])
    myfont=pygame.font.SysFont(msg, 25)
    text=myfont.render(msg, True, (0, 0, 0))
    window.blit(text,(x, y+bar_height+20))

#------------------------------------------------

def displayarr(state):

    '''
      displays the array values as bars

      state - An array that states the color of every element in color

    '''
    for i in range(ARR_SIZE):
        if STATE[i] == 0:       #red
            color=(255, 0, 0)
        elif STATE[i] == 2:     #green
            color=(0, 255, 0)
        else:
            color=(0, 0, 255)   #blue
        draw_bar(i, color)
    
    pygame.display.update()
    time.sleep(SPEED)
 
#-------------------------------------

def insertionsort(arr):

    '''
       sorts the array of elements using insertion_sort technique
    '''
    for i in range(1, len(arr)):
        key = arr[i]
        j = i-1
        STATE[i] = 0
        displayarr(STATE)
        clear_screen(window)
        while j>=0 and key<arr[j]:
            arr[j+1] = arr[j]
            j = j-1
            STATE[j+1] = 0
            displayarr(STATE)
            clear_screen(window)
            STATE[j+1] = 2
            displayarr(STATE)
            clear_screen(window)
        arr[j+1] = key
        if j<0:
            STATE[j+1] = 2 
        else:
            STATE[j] = 2
        STATE[i] = 2
        displayarr(STATE)
        clear_screen(window)
        


#---------------------------------------'

#driver code        
if __name__=="__main__":
    running = True
    while running:
        is_clicked=button(window, 'Sort', WIDTH/2 - 60, HEIGHT/2 - 50, 80, 50, BLUE, ORANGE)
        pygame.display.update()

        if is_clicked:
            break
        check_exit()
    
    clear_screen(window)

    displayarr(STATE)
    insertionsort(ARR)

    while True:
        check_exit()