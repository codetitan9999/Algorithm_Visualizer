import pygame, random,time
#from pygame_utilities import *

WIDTH = 1280
HEIGHT = 720
GAP = 8
DELAY = 30
ARRSIZE = 20
RECTW = 40

WHITE=(255,255,255)
GREEN=(0,255,0)
BLUE=(0,0,255)
BLACK=(0,0,0)
RED=(255,0,0)

arr = [random.randrange(50, 350) for i in range(ARRSIZE)]
fixedIndices = []
swappingList=[]

pygame.init()
window = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption('Quick Sort')


def displayArr(pivot):

    '''
    Displays the array as bars of height equal to the value
    '''
    #time.sleep(1)

    window.fill(WHITE) 

    for i in range(len(arr)):

        if i in fixedIndices:
            color = (0, 255, 0) # green
        elif i==pivot:
            color = (0,0,0)    #black
        elif i in swappingList:
            color = (0,0,255)
        else:
            color = (255, 165, 0) # orange

        # (x-cord, y-cord, width, height)
        pygame.draw.rect(window, color, ((i+3) * (RECTW + GAP), 500 - arr[i], RECTW, arr[i]))
        msg=str(arr[i])
        myfont=pygame.font.SysFont(msg,25)
        text=myfont.render(msg,True,BLACK)
        window.blit(text,((i+3) * (RECTW + GAP),500+20))

    pygame.display.update()
    pygame.time.wait(50)
    time.sleep(0.5)
    
def displayGreen():

    '''
    The final green wipe on the sorted array
    '''

    for i in range(len(arr)):

        color = (0, 255, 0) # green

        # (x-cord, y-cord, width, height)
        pygame.draw.rect(window, color, ((i+3)* (RECTW + GAP), 500 - arr[i], RECTW, arr[i]))

        pygame.display.update()
        pygame.time.wait(10)


def logArr():
    for val in arr:
        print(val, end = ' ')
    print()


def quickSort(arr, start , stop):

    '''
    Sorts the given arr from start to stop indexes
    using the randmized quickSort algorithm
    '''

    # if there is less than one element
    # no need to sort
    if(start >= stop): 
        return        

    pivotIndex = partitionRand(arr, start, stop)

    fixedIndices.append(pivotIndex)
    
    # The array is partitioned at pivotIndex and
    # pivotIndex element is at it's final index
    # sort the two subarrays 
    # before and after the pivot
    quickSort(arr , start , pivotIndex - 1)
    quickSort(arr, pivotIndex + 1, stop)
 

def partitionRand(arr, start, stop):

    '''
    Generates a random index between start and stop
    and partitions the array
    '''
 
    randPivot = random.randrange(start, stop)

    displayArr(randPivot)
    pygame.time.wait(10)

    # swap arr[stop] and arr[randPivot]
    arr[stop], arr[randPivot] = arr[randPivot], arr[stop]
    displayArr(randPivot)

    return partition(arr, start, stop)


def partition(arr, start, stop):

    '''
    Partitions the array at the pivot(the last element) 
    All the elements less than the pivot are to brought to it's left
    All the elements greater than the pivot are brought to it's right
    '''

    pivot = stop 
    i = start - 1
     
    for j in range(start, stop):
        if arr[j] <= arr[pivot]:
            i = i + 1
            swappingList.append(i)
            swappingList.append(j)
            displayArr(pivot)
            arr[i] , arr[j] = arr[j] , arr[i]
            displayArr(pivot)
            swappingList.clear()

    #swap arr[i] and arr[pivot]
    swappingList.append(i+1)
    displayArr(pivot)
    arr[pivot] , arr[i + 1] = arr[i + 1] , arr[pivot]
    displayArr(pivot)
    swappingList.clear()

    pivot = i + 1
    return pivot


# Driver Code
if __name__ == "__main__":

    running = True
    firstTime = True

    while running:

        window.fill((0, 0, 0))

        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False

        if firstTime:
            quickSort(arr, 0, ARRSIZE - 1)

            # some bars are left untouched cause they come to their place by magically
            # to make everything look uniform green wash them all
            displayGreen()
        
        firstTime = False