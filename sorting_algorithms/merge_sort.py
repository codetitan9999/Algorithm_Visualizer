import pygame,random,time,sys
from pygame_utilities import *

# setup
pygame.init()
screen = pygame.display.set_mode((WIDTH,HEIGHT))
pygame.display.set_caption('MERGE SORT VISUALISER')
clear_screen(screen)

# inputs
arr_size = 15
bar_width = 30
space = 10
speed = .5

# inital state
array = [0] * arr_size

# random array creation

def generate_array(arr_size) :
    '''
    Generates an array of random numbers from 1 to arr_size.
    '''
    for i in range(arr_size):
        array[i] = random.randint(1, 20)

# merge Sort (recursive)

def mergesort(array, left_limit, right_limit) :
    '''
    Sorts the array and displays the updated array at every swap.
    
    '''
    mid = (left_limit + right_limit)//2

    if left_limit < right_limit :
        mergesort(array, left_limit, mid)
        mergesort(array, mid+1, right_limit)
        mergearray(array, left_limit, mid, right_limit)


# merge two arrays function

def mergearray(array, l1, r1, r2) :
    '''
    Combines two arrays with respect to their values in ascending order and 
    returns the newly formed array

    '''
    l2 = r1 + 1
    i = 0    # index used to iterate through the left sublist
    j = 0    # index udes to iterate through the right sublist
    a = l1   # sorted index
    left_list = array[l1 : r1 + 1]
    right_list = array[l2 : r2 + 1]

    while i < len(left_list) and j < len(right_list):
        for k in range(arr_size):
            if k==i or k==j:
                ind1 = i + l1
                ind2 = j + l2
                draw_bar(k, True)
            else :
                draw_bar(k, False)
        
        pygame.display.update()
        time.sleep(speed)
        
        if left_list[i] <= right_list[j] :
            array[a] = left_list[i]
            i = i + 1
        else :
            array[a] = right_list[j]
            j = j + 1
        
        a = a + 1
        clear_screen(screen)

        for k in range(arr_size):
            if k == ind1 or k == ind2:
                draw_bar(k, True)
            else :
                draw_bar(k, False)
        
        pygame.display.update()
        time.sleep(speed)

   
    while i < len(left_list) :
        array[a] = left_list[i]
        i = i + 1
        a = a + 1
    
    while j < len(right_list) : 
        array[a] = right_list[j]
        j = j + 1
        a = a + 1
        
    #for k in range(arr_size):
    #   if k==i or k==j:
    #       draw_bar(k, True)
    #   else :
    #       draw_bar(k, False)
        
    #pygame.display.update()
    #time.sleep(speed)

    
    

# draw functionos
                        
def draw_bar(ind, com):
    '''
    Draws a single bar. arr[ind] * 10 is taken as the height of the bar (for better display)
    The x, y coords are determined using ind and arr[ind]
    is_compared: if true draws a orange bar else a green bar
    '''

    bar_height = array[ind] * 10
    color = [BLUE, ORANGE][com]

    x = ind * (bar_width + space) + (WIDTH - (arr_size * (bar_width + space))) / 2
    y = HEIGHT / 2 - bar_height

    pygame.draw.rect(screen, color, (x, y, bar_width, bar_height), 0)
    msg = str(array[ind])
    myfont = pygame.font.SysFont(msg, 25)
    text = myfont.render(msg, True, (0, 0, 0))
    screen.blit(text, (x, y + bar_height + 20))


# draw all bars function
 
def draw_all_bars():

    '''
    Draws bar representation for all the values in the arr.
    All bars have the same color.
    '''

    for i in range(arr_size):
        draw_bar(i, False)


if __name__ == '__main__':

    while True:
        is_clicked = button(screen, 'Sort', WIDTH / 2 - 60, HEIGHT / 2 - 50, 80, 50, BLUE, ORANGE)
        pygame.display.update()

        if is_clicked:
            break
        
        check_exit()
        

    clear_screen(screen)
    # generate_array(arr_size)
    array = [8,3,4,5,2,9,10,12,1,14,15,7,6,13,11]
    draw_all_bars()
    mergesort(array, 0, arr_size-1)


    while True:
        check_exit()
