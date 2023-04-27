import pygame
from sys import exit



WIDTH = 800
HEIGHT = 600

RED = (255, 0, 0)
GREEN = (0, 255, 0)
BLUE = (0, 255, 0)
YELLOW = (255, 255, 0)
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)
PURPLE = (128, 0, 128)
ORANGE = (255, 165 ,0)
GREY = (128, 128, 128)
TURQUOISE = (64, 224, 208)



def button(screen, msg, x, y, w, h, ic, ac) -> bool:
    mouse = pygame.mouse.get_pos()
    click = pygame.mouse.get_pressed()
    is_clicked = False

    if x + w > mouse[0] > x and y + h > mouse[1] > y:
        pygame.draw.rect(screen, ac, (x, y, w, h), 0)

        if click[0] == 1:
            is_clicked = True

    else:
        pygame.draw.rect(screen, ic, (x, y, w, h), 0)

    myfont = pygame.font.SysFont(msg, 30)
    text = myfont.render(msg, True, WHITE)
    screen.blit(text, (x + 20, y + 15))

    return is_clicked
    

def check_exit():
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            pygame.quit()
            exit()


def clear_screen(screen):
    screen.fill(WHITE)