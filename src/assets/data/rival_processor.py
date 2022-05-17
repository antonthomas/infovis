# -*- coding: utf-8 -*-
#################################################################################
# Extract matches that were played between two players from our top 30 players
#################################################################################
import json
import pandas as pd
from data_processor import *

top_players = ["Novak Djokovic","Daniil Medvedev","Alexander Zverev","Rafael Nadal","Stefanos Tsitsipas","Matteo Berrettini","Casper Ruud","Andrey Rublev","Felix Auger-Aliassime","Cameron Norrie","Jannik Sinner","Taylor Fritz","Hubert Hurkacz","Diego Schwartzman",
"Denis Shapovalov","Reilly Opelka","Pablo Carreno Busta","Roberto Bautista Agut","Nikoloz Basilashvili","Gael Monfils","Grigor Dimitrov","Marin Cilic","Alex de Minaur","John Isner","Karen Khachanov","Lorenzo Sonego","Alejandro Davidovich Fokina","Frances Tiafoe"]
player_ids = map(name_to_id, top_players)

df = pd.read_csv("all_matches_filtered.csv")


def extractInfo(matches):
    matches.sort_values("start_date", ascending=False)
    matches_played = len(matches)
    matches_won = len(matches[matches["player_victory"] == "t"])
    
    last_five = []
    for index, row in matches.head(5).iterrows():
        last_five.append("W" if (row["player_victory"] == "t") else "L")
        
    return (matches_played, matches_won, last_five)

def processCouple(pId, oId):
    all_matches = df[(df["player_id"] == pId) & (df["opponent_id"] == oId)]
    return extractInfo(all_matches)
    # print(pId, " v.s. ", oId)
    # print(info[2])
    # print()
    
    
def processPlayer(id):
    opponent_ids = map(name_to_id, top_players)
    dic = {
        "playerId": id,
        "opponents": []
        }
    for opponent in opponent_ids:
        if opponent != id:
            info = processCouple(id, opponent)
            info_dict = {
                "opponentId": opponent,
                "matchesPlayed": info[0],
                "matchesWon": info[1],
                "lastFive": info[2]
                }
            dic["opponents"].append(info_dict)
    return dic

def processAll():
    all_couples = []
    for player in player_ids:
        player_rivals = processPlayer(player)
        all_couples.append(player_rivals)
        
    json_data = json.dumps(all_couples)
    with open("playerRivals.json", "w") as outfile:
        outfile.write(json_data)

processAll()