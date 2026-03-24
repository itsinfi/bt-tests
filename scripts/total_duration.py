import matplotlib.pyplot as plt
import os

# durations = [4665045.767991, 4480295.712993, 4965235.502726, 4965067.356803]
durations = [77.75076279985, 74.67159521655, 82.753925045433333333333333333333, 82.751122663383333333333333333333]

plt.figure(figsize=(5, 5))
plt.xlabel('Applikation')
plt.ylabel('Zeit (in min)')
plt.grid(axis='y', linestyle='--', alpha=0.3, color='black')

x = ['Express', 'Fastify', 'JAX-RS', 'HttpSerlvet']
y = durations

colors = ["#F8DF54", "#70B851", "#546CF8", "#F85454"]

plt.bar(x, y, color=colors)

plt.savefig('plots/final/bla.png')
plt.close()
print(f'plot in bla gespeichert')