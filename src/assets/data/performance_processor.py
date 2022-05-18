# -*- coding: utf-8 -*-
#################################################################################
# Extract performance stats from the top 30 players
#################################################################################
import json
import pandas as pd
from data_processor import *

top_players = ["Novak Djokovic","Daniil Medvedev","Alexander Zverev","Rafael Nadal","Stefanos Tsitsipas","Matteo Berrettini","Casper Ruud","Andrey Rublev","Felix Auger-Aliassime","Cameron Norrie","Jannik Sinner","Taylor Fritz","Hubert Hurkacz","Diego Schwartzman",
"Denis Shapovalov","Reilly Opelka","Pablo Carreno Busta","Roberto Bautista Agut","Nikoloz Basilashvili","Gael Monfils","Grigor Dimitrov","Marin Cilic","Alex de Minaur","John Isner","Karen Khachanov","Lorenzo Sonego","Alejandro Davidovich Fokina","Frances Tiafoe"]
player_ids = map(name_to_id, top_players)


"""

data = [
    { player: 60, opponent: 50, average: 90, playerLast5: 55, OpponentLast5: 90, metric: '1st serve' },
    { player: 60, opponent: 60, average: 50, playerLast5: 55, OpponentLast5: 45, metric: '2nd serve' },
    { player: 60, opponent: 70, average: 50, playerLast5: 30, OpponentLast5: 45, metric: 'Tie break win' },
    { player: 30, opponent: 30, average: 50, playerLast5: 30, OpponentLast5: 45, metric: 'Service games win' },
    { player: 30, opponent: 30, average: 50, playerLast5: 30, OpponentLast5: 45, metric: 'Return games win' },
    { player: 40, opponent: 35, average: 50, playerLast5: 30, OpponentLast5: 45, metric: 'Double Fault' },
    { player: 80, opponent: 50, average: 50, playerLast5: 30, OpponentLast5: 45, metric: 'Break point save' },
    { player: 40, opponent: 70, average: 50, playerLast5: 30, OpponentLast5: 45, metric: 'Break point against' },
  ];

"""


def findPlayer(oId, players):
    res = {}
    for sub in players:
        if sub['player_id'] == oId:
            res = sub
            break
    return res


def opponents_data(player, players, averages):
    opponent_ids = map(name_to_id, top_players)
    d = []
    pId = player["player_id"]
    for oId in opponent_ids:
        if not oId == pId:
            opponent = findPlayer(oId, players)
            v = [
                    { "player": player["first_serve_made_perc"], "opponent": opponent["first_serve_made_perc"], "average": averages["first_serve_made_perc"], "playerLast5": player["first_serve_made_perc_five"], "opponentLast5": opponent["first_serve_made_perc_five"], "metric": '1st serve' },
                    { "player": player["second_serve_made_perc"], "opponent": opponent["second_serve_made_perc"], "average": averages["second_serve_made_perc"], "playerLast5": player["second_serve_made_perc_five"], "opponentLast5": opponent["second_serve_made_perc_five"], "metric": '2nd serve' },
                    { "player": player["tie_breaks_won_perc"], "opponent": opponent["tie_breaks_won_perc"], "average": averages["tie_breaks_won_perc"], "playerLast5": player["tie_breaks_won_perc_five"], "opponentLast5": opponent["tie_breaks_won_perc_five"], "metric": 'Tie break win' },
                    { "player": player["service_games_won_perc"], "opponent": opponent["service_games_won_perc"], "average": averages["service_games_won_perc"], "playerLast5": player["service_games_won_perc_five"], "opponentLast5": opponent["service_games_won_perc_five"], "metric": 'Service games win' },
                    { "player": player["return_games_won_perc"], "opponent": opponent["return_games_won_perc"], "average": averages["return_games_won_perc"], "playerLast5": player["return_games_won_perc_five"], "opponentLast5": opponent["return_games_won_perc_five"], "metric": 'Return games win' },
                    { "player": player["double_faults_perc"], "opponent": opponent["double_faults_perc"], "average": averages["double_faults_perc"], "playerLast5": player["double_faults_perc_five"], "opponentLast5": opponent["double_faults_perc_five"], "metric": 'Double Fault' },
                    { "player": player["break_points_saved_perc"], "opponent": opponent["break_points_saved_perc"], "average": averages["break_points_saved_perc"], "playerLast5": player["break_points_saved_perc_five"], "opponentLast5": opponent["break_points_saved_perc_five"], "metric": 'Break point save' },
                    { "player": player["break_points_against_perc"], "opponent": opponent["break_points_against_perc"], "average": averages["break_points_against_perc"], "playerLast5": player["break_points_against_perc_five"], "opponentLast5": opponent["break_points_against_perc_five"], "metric": 'Break point against' },
              ];
            d.append({
                "opponentId": oId,
                "values": v
                })
    return d

def match_player_with_opponents(averages, players):
    data = []
    
    for player in players:
        pId = player["player_id"]
        data.append({
                "playerId": pId,
                "opponents": opponents_data(player, players, averages)
                })
    return data
                
    
def process_all_players_performance_stats():
    df = pd.read_csv("all_matches_filtered.csv").sort_values("start_date", ascending=False)
    
    rows = []
    
    for player_id in player_ids:
                x = df[df["player_id"] == (player_id)]
                
                first_serve_made = x["first_serve_made"].sum()
                first_serve_attempted = x["first_serve_attempted"].sum()
                first_serve_made_five = x["first_serve_made"].head(5).sum()
                first_serve_attempted_five =x["first_serve_attempted"].head(5).sum()

                
                second_serve_made = x["second_serve_points_made"].sum()
                second_serve_attempted = x["second_serve_points_attempted"].sum()
                second_serve_made_five = x["second_serve_points_made"].head(5).sum()
                second_serve_attempted_five = x["second_serve_points_attempted"].head(5).sum()
                
                tiebreaks_won = x["tiebreaks_won"].sum()
                tiebreaks_total = x["tiebreaks_total"].sum()
                tiebreaks_won_five = x["tiebreaks_won"].head(5).sum()
                tiebreaks_total_five = x["tiebreaks_total"].head(5).sum()
                
                service_games_won = x["service_games_won"].sum()
                service_games_won_five = x["service_games_won"].head(5).sum()
                
                double_faults = x["double_faults"].sum()
                double_faults_five = x["double_faults"].head(5).sum()
                
                break_points_saved = x["break_points_saved"].sum()
                break_points_saved_five = x["break_points_saved"].head(5).sum()
                
                break_points_against = x["break_points_against"].sum()
                break_points_against_five = x["break_points_against"].head(5).sum()
                
                
                games_won_five = x.head(5)["games_won"].sum()
                games_against_five = x.head(5)["games_against"].sum()
                games_won = x["games_won"].sum()
                games_against = x["games_against"].sum()
        
                first_serve_made_perc = div_or_zero(first_serve_made, (first_serve_attempted))
                first_serve_made_perc_five = div_or_zero(first_serve_made_five, (first_serve_attempted_five))
                
                second_serve_made_perc = div_or_zero(second_serve_made, (second_serve_attempted))
                second_serve_made_perc_five = div_or_zero(second_serve_made_five, (second_serve_attempted_five))
                
                tie_breaks_won_perc = div_or_zero(tiebreaks_won, tiebreaks_total)
                tie_breaks_won_perc_five = div_or_zero(tiebreaks_won_five, tiebreaks_total_five)
                
                service_games_won_perc = div_or_zero(service_games_won , ((games_won + games_against) / 2))
                t = div_or_zero(service_games_won_five , ((games_won_five + games_against_five) / 2))
                service_games_won_perc_five = t if t <= 100 else 100.0

                return_games_won_perc = div_or_zero((games_won - service_games_won) , ((games_won + games_against) / 2))
                return_games_won_perc_five = div_or_zero((games_won_five - service_games_won_five) , ((games_won_five + games_against_five) / 2))

                double_faults_perc = div_or_zero(double_faults, first_serve_attempted)
                double_faults_perc_five = div_or_zero(double_faults_five, first_serve_attempted_five)

                break_points_saved_perc = div_or_zero(break_points_saved , break_points_against)
                break_points_saved_perc_five = div_or_zero(break_points_saved_five , break_points_against_five)
        
                break_points_against_perc = div_or_zero(break_points_against , (games_won + games_against) / 2)
                break_points_against_perc_five = div_or_zero(break_points_against_five , (games_won_five + games_against_five) / 2)

                p = {
                    "player_id": player_id,
                    
                    "first_serve_made_perc": first_serve_made_perc,
                    "first_serve_made_perc_five": first_serve_made_perc_five,
                    
                    "second_serve_made_perc": second_serve_made_perc,
                    "second_serve_made_perc_five": second_serve_made_perc_five,
                    
                    "tie_breaks_won_perc": tie_breaks_won_perc,
                    "tie_breaks_won_perc_five": tie_breaks_won_perc_five,
                    
                    "service_games_won_perc": service_games_won_perc,
                    "service_games_won_perc_five": service_games_won_perc_five,
                    
                    "return_games_won_perc": return_games_won_perc,
                    "return_games_won_perc_five": return_games_won_perc_five,
                    
                    "double_faults_perc": double_faults_perc,
                    "double_faults_perc_five": double_faults_perc_five,
                    
                     "break_points_saved_perc": break_points_saved_perc,
                     "break_points_saved_perc_five": break_points_saved_perc_five,

                     "break_points_against_perc": break_points_against_perc,
                     "break_points_against_perc_five": break_points_against_perc_five,
                }
                rows.append(p)
    return rows

def process_averages():
    x = pd.read_csv("all_matches_filtered.csv")
    
    first_serve_made = x["first_serve_made"].sum()
    first_serve_attempted = x["first_serve_attempted"].sum()
    
    second_serve_made = x["second_serve_points_made"].sum()
    second_serve_attempted = x["second_serve_points_attempted"].sum()
    
    tiebreaks_won = x["tiebreaks_won"].sum()
    tiebreaks_total = x["tiebreaks_total"].sum()
    
    service_games_won = x["service_games_won"].sum()

    double_faults = x["double_faults"].sum()
    
    break_points_saved = x["break_points_saved"].sum()
    
    break_points_against = x["break_points_against"].sum()
    
    games_won = x["games_won"].sum()
    games_against = x["games_against"].sum()
    
    
    first_serve_made_perc = div_or_zero(first_serve_made, (first_serve_attempted))
    
    second_serve_made_perc = div_or_zero(second_serve_made, (second_serve_attempted))
    
    tie_breaks_won_perc = div_or_zero(tiebreaks_won, tiebreaks_total)
    
    service_games_won_perc = div_or_zero(service_games_won , ((games_won + games_against) / 2))

    return_games_won_perc = div_or_zero((games_won - service_games_won) , ((games_won + games_against) / 2))

    double_faults_perc = div_or_zero(double_faults, first_serve_attempted)

    break_points_saved_perc = div_or_zero(break_points_saved , break_points_against)

    break_points_against_perc = div_or_zero(break_points_against , (games_won + games_against) / 2)

    avg = {
        "first_serve_made_perc": first_serve_made_perc,
        
        "second_serve_made_perc": second_serve_made_perc,
        
        "tie_breaks_won_perc": tie_breaks_won_perc,
        
        "service_games_won_perc": service_games_won_perc,
        
        "return_games_won_perc": return_games_won_perc,
        
        "double_faults_perc": double_faults_perc,
        
         "break_points_saved_perc": break_points_saved_perc,

         "break_points_against_perc": break_points_against_perc,
    }
    
    
    return avg

def generate_performance_stats():
    averages = process_averages()
    raw_data = process_all_players_performance_stats()
    data = match_player_with_opponents(averages, raw_data)
    
    json_data = json.dumps(data)
    with open("performanceStats.json", "w") as outfile:
        outfile.write(json_data)

generate_performance_stats()
