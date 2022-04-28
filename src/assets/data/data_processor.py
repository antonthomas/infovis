#################################################################################
# Extract matches from the last 5 years and top 30 players from all_matches.csv #
#################################################################################
# Columns:
# start_date,end_date,location,court_surface,prize_money,currency,year,player_id,player_name,opponent_id,opponent_name,tournament,round,num_sets,sets_won,games_won,games_against,tiebreaks_won,tiebreaks_total,serve_rating,aces,double_faults,first_serve_made,first_serve_attempted,first_serve_points_made,first_serve_points_attempted,second_serve_points_made,second_serve_points_attempted,break_points_saved,break_points_against,service_games_won,return_rating,first_serve_return_points_made,first_serve_return_points_attempted,second_serve_return_points_made,second_serve_return_points_attempted,break_points_made,break_points_attempted,return_games_played,service_points_won,service_points_attempted,return_points_won,return_points_attempted,total_points_won,total_points,duration,player_victory,retirement,seed,won_first_set,doubles,masters,round_num,nation

import pandas as pd

top_players = ["Novak Djokovic","Daniil Medvedev","Alexander Zverev","Rafael Nadal","Stefanos Tsitsipas","Matteo Berrettini","Casper Ruud","Andrey Rublev","Carlos Alcaraz","Felix Auger-Aliassime","Cameron Norrie","Jannik Sinner","Taylor Fritz","Hubert Hurkacz","Diego Schwartzman",
"Denis Shapovalov","Reilly Opelka","Pablo Carreno Busta","Roberto Bautista Agut","Nikoloz Basilashvili","Gael Monfils","Grigor Dimitrov","Marin Cilic","Alex de Minaur","John Isner","Karen Khachanov","Lorenzo Sonego","Alejandro Davidovich Fokina","Frances Tiafoe","Cristian Garin"]

def name_to_id(name):
    parts = name.lower().split(" ")
    result = ""
    for part in parts:
        result += (part + "-")
    return result[:-1]

player_ids = map(name_to_id, top_players)

df = pd.read_csv("all_matches.csv")
df["start_date"] = pd.to_datetime(df["start_date"])

# Filter on last 5 years
df = df[(df["start_date"] > pd.to_datetime("2013-01-01"))]

# Filter on top 30 players
filtered = df[(df["player_id"].isin(player_ids)) | (df["opponent_id"].isin(player_ids))]
filtered.to_csv("all_matches_filtered.csv")
print(len(filtered.index))
