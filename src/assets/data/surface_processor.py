# -*- coding: utf-8 -*-
#################################################################################
# Extract surface performance from the top 30 players
#################################################################################
import json
import pandas as pd
from data_processor import *

top_players = ["Novak Djokovic","Daniil Medvedev","Alexander Zverev","Rafael Nadal","Stefanos Tsitsipas","Matteo Berrettini","Casper Ruud","Andrey Rublev","Felix Auger-Aliassime","Cameron Norrie","Jannik Sinner","Taylor Fritz","Hubert Hurkacz","Diego Schwartzman",
"Denis Shapovalov","Reilly Opelka","Pablo Carreno Busta","Roberto Bautista Agut","Nikoloz Basilashvili","Gael Monfils","Grigor Dimitrov","Marin Cilic","Alex de Minaur","John Isner","Karen Khachanov","Lorenzo Sonego","Alejandro Davidovich Fokina","Frances Tiafoe"]
player_ids = map(name_to_id, top_players)

df = pd.read_csv("all_matches_filtered.csv")

def processPLayer(id):
    all_matches = df[df["player_id"] == id]
    dict = {}
    for index, row in all_matches.iterrows():
        surf = row["court_surface"]
        if surf in dict:
            t = dict[surf]
            dict[surf] = (t[0] + 1, (t[1] + 1) if (row["player_victory"] == "t") else t[1])
        else:
            dict[surf] = (1, 1 if (row["player_victory"] == "t") else 0)
    if not "Carpet" in dict:
        dict["Carpet"] = (0,0)
    
    axes = []
    for key in dict:
        tuple = dict[key]
        axes.append({
            "axis": key,
            "value": round((tuple[1]/tuple[0]) * 100, 2) if (not tuple[0] == 0) else 0
        })
    return axes

def processAllPlayers():
    data = []
    for player in player_ids:
        axes = processPLayer(player)
        data.append({
            "name": id_to_name(player),
            "axes": axes
            })
    
    json_data = json.dumps(data)
    with open("playerSurface.json", "w") as outfile:
        outfile.write(json_data)
        
processAllPlayers()
"""

var data = [
  {
    name: 'Player',
    axes: [
      { axis: 'Clay', value: 42 },
      { axis: 'Grass', value: 20 },
      { axis: 'Hard', value: 60 },
      { axis: 'Carpet', value: 26 },
      // { axis: 'Information Technology', value: 35 },
      // { axis: 'Administration', value: 20 },
    ],
  },
  {
    name: 'Opponent',
    axes: [
      { axis: 'Clay', value: 50 },
      { axis: 'Grass', value: 45 },
      { axis: 'Hard', value: 20 },
      { axis: 'Carpet', value: 20 },
      // { axis: 'Information Technology', value: 25 },
      // { axis: 'Administration', value: 23 },
    ],
  },
];

"""