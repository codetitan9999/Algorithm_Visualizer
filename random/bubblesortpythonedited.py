import pygame, sys, random
white=(255,255,255)
black=(0,0,0)

width=600
height=550

pygame.init()

win=pygame.display.set_mode((width,height))
pygame.display.set_caption("BUBBLE SORT")

clock=pygame.time.Clock()

n=20

#w=int(width/n)
w=15
h_arr=[]
states=[]

for i in range(w):
	h=random.randint(10,450)
	h_arr.append(h)
	states.append(1)

counter=0
while True:
	win.fill(black)
	pygame.time.delay(100)
	if counter < len(h_arr):
		for j in range(len(h_arr)-1-counter):
			win.fill(black)
			if h_arr[j]>h_arr[j+1]:
				states[j]=0
				#states[j+1]=0
				
				for k in range(len(h_arr)):
					if states[k]==0:
						color=(225,0,0)
					if states[k]==1:
						color=white
					if states[k]==2:
						color=(0,225,0)
					pygame.draw.rect(win,color,pygame.Rect(int(k*n),height-h_arr[k],n-1,h_arr[k]))
					
				
				clock.tick(5)
				states[j]=1
				temp=h_arr[j]
				h_arr[j]=h_arr[j+1]
				h_arr[j+1]=temp
				states[j+1]=0
				win.fill(black)
				for k in range(len(h_arr)):
					if states[k]==0:
						color=(225,0,0)
					if states[k]==1:
						color=white
					if states[k]==2:
						color=(0,225,0)
					pygame.draw.rect(win,color,pygame.Rect(int(k*n),height-h_arr[k],n-1,h_arr[k]))
			else:
				for k in range(len(h_arr)):
					if states[k]==0:
						color=(225,0,0)
					if states[k]==1:
						color=white
					if states[k]==2:
						color=(0,225,0)
					pygame.draw.rect(win,color,pygame.Rect(int(k*n),height-h_arr[k],n-1,h_arr[k]))


				states[j]=1
				states[j+1]=1
			#clock.tick(1)
	else:

		for k in range(len(h_arr)):
				if states[k]==0:
					color=(225,0,0)
				if states[k]==1:
					color=white
				if states[k]==2:
					color=(0,225,0)
				pygame.draw.rect(win,color,pygame.Rect(int(k*n),height-h_arr[k],n-1,h_arr[k]))


	counter=counter+1
	
	if len(h_arr)-counter>=0:
		states[len(h_arr)-counter] = 2

		
	for event in pygame.event.get():
		if event.type==pygame.QUIT:
			pygame.quit()
			sys.exit()
	
	clock.tick(5)
	pygame.display.flip()