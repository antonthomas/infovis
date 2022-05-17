#################################################################################
# Extract matches from the last 5 years and top 30 players from all_matches.csv #
#################################################################################
# Columns:
# start_date,end_date,location,court_surface,prize_money,currency,year,player_id,player_name,opponent_id,opponent_name,tournament,round,num_sets,sets_won,games_won,games_against,tiebreaks_won,tiebreaks_total,serve_rating,aces,double_faults,first_serve_made,first_serve_attempted,first_serve_points_made,first_serve_points_attempted,second_serve_points_made,second_serve_points_attempted,break_points_saved,break_points_against,service_games_won,return_rating,first_serve_return_points_made,first_serve_return_points_attempted,second_serve_return_points_made,second_serve_return_points_attempted,break_points_made,break_points_attempted,return_games_played,service_points_won,service_points_attempted,return_points_won,return_points_attempted,total_points_won,total_points,duration,player_victory,retirement,seed,won_first_set,doubles,masters,round_num,nation

import pandas as pd
import math

top_players = ["Novak Djokovic","Daniil Medvedev","Alexander Zverev","Rafael Nadal","Stefanos Tsitsipas","Matteo Berrettini","Casper Ruud","Andrey Rublev","Felix Auger-Aliassime","Cameron Norrie","Jannik Sinner","Taylor Fritz","Hubert Hurkacz","Diego Schwartzman",
"Denis Shapovalov","Reilly Opelka","Pablo Carreno Busta","Roberto Bautista Agut","Nikoloz Basilashvili","Gael Monfils","Grigor Dimitrov","Marin Cilic","Alex de Minaur","John Isner","Karen Khachanov","Lorenzo Sonego","Alejandro Davidovich Fokina","Frances Tiafoe"]

def name_to_id(name):
    parts = name.lower().split(" ")
    result = ""
    for part in parts:
        result += (part + "-")
    return result[:-1]

def id_to_name(id):
    parts = id.lower().split("-")
    result = ""
    for part in parts:
        result += (part + " ")
    return result[:-1]

player_ids = map(name_to_id, top_players)

def process_all_matches():
    df = pd.read_csv("all_matches.csv")
    df["start_date"] = pd.to_datetime(df["start_date"])

    # Filter on last 5 years
    df = df[(df["start_date"] > pd.to_datetime("2013-01-01"))]

    # Filter on top 30 players
    filtered = df[(df["player_id"].isin(player_ids)) | (df["opponent_id"].isin(player_ids))]
    filtered.to_csv("all_matches_filtered.csv")
    print(len(filtered.index))

def process_all_players():
    # TODO: rank players
    # TODO: 2-char country code

    rank_player_id_tuple_list = list(enumerate(player_ids, start=1))
    dict = {}
    for (rank, id) in rank_player_id_tuple_list:
        dict[id] = rank

    df = pd.read_csv("all_players.csv")
    # TODO: problem with filtering
    filtered = df[df["player_id"].isin(dict.keys())]
    # print(filtered)

    ranks = []
    for id in filtered["player_id"].to_list():
        ranks.append(dict[id])

    # TODO: add ranks to df
    # TODO: write to csv

    return filtered

def process_diverging_data_all():
    df = pd.read_csv("all_matches_filtered.csv")
    rows = []
    surface_lists = [["Hard"], ["Clay"], ["Grass"], ["Carpet"], ["Hard", "Clay", "Grass", "Carpet"]]
    for surface_list in surface_lists:
        print(surface_list)
        df_surface = df[df["court_surface"].isin(surface_list)]
        surface = "All surfaces"
        if len(surface_list) == 1:
            surface = surface_list[0]

        first_serve_made = df_surface["first_serve_made"].sum()
        first_serve_attempted =df_surface["first_serve_attempted"].sum()
        tiebreaks_won = df_surface["tiebreaks_won"].sum()
        tiebreaks_total = df_surface["tiebreaks_total"].sum()
        break_points_made = df_surface["break_points_made"].sum()
        break_points_attempted = df_surface["break_points_attempted"].sum()
        break_points_against = df_surface["break_points_against"].sum()
        break_points_against = df_surface["break_points_against"].sum()
        break_points_saved = df_surface["break_points_saved"].sum()
        service_games_won = df_surface["service_games_won"].sum()
        games_won = df_surface["games_won"].sum()
        games_against = df_surface["games_against"].sum()
        aces = df_surface["aces"].sum()

        first_serve_made_perc = first_serve_made / (first_serve_made + first_serve_attempted)
        tie_breaks_won_perc = tiebreaks_won / tiebreaks_total
        break_points_made_player_perc = break_points_made / (break_points_made + break_points_attempted)
        break_points_made_opponent_perc = break_points_against / (break_points_saved + break_points_against)
        break_points_saved_player_perc = break_points_saved / (break_points_against + break_points_against)
        service_games_won_perc = service_games_won / ((games_won + games_against) / 2)
        return_games_won_perc = (games_won - service_games_won) / (games_won + games_against)
        aces_to_total_serves = aces / (first_serve_attempted + first_serve_made)
        aces_to_serves_made = aces / first_serve_made

        row = {
            "court_surface": surface,
            "first_serve_made_perc": first_serve_made_perc,
			"tie_breaks_won_perc": tie_breaks_won_perc,
			"break_points_made_player_perc": break_points_made_player_perc,
			"break_points_made_opponent_perc": break_points_made_opponent_perc,
			"break_points_saved_player_perc": break_points_saved_player_perc,
			"service_games_won_perc": service_games_won_perc,
			"return_games_won_perc": return_games_won_perc,
			"aces_to_total_serves": aces_to_total_serves,
			"aces_to_serves_made": aces_to_serves_made
        }
        rows.append(row)

        df_result = pd.DataFrame(rows)
        df_result.to_csv("diverging_data_all.csv")


def div_or_zero(numerator, denominator):
    if denominator != 0:
        return numerator / denominator
    return 0



def process_diverging_data_players():
    df = pd.read_csv("all_matches_filtered.csv")
    rows = []
    surface_lists = [["Hard"], ["Clay"], ["Grass"], ["Carpet"], ["Hard", "Clay", "Grass", "Carpet"]]
    for player_id in player_ids:
        x = df[df["player_id"] == (player_id)]
        for surface_list in surface_lists:
            df_surface = x[x["court_surface"].isin(surface_list)]
            surface = "All surfaces"
            if len(surface_list) == 1:
                surface = surface_list[0]

            first_serve_made = df_surface["first_serve_made"].sum()
            first_serve_attempted =df_surface["first_serve_attempted"].sum()
            tiebreaks_won = df_surface["tiebreaks_won"].sum()
            tiebreaks_total = df_surface["tiebreaks_total"].sum()
            break_points_made = df_surface["break_points_made"].sum()
            break_points_attempted = df_surface["break_points_attempted"].sum()
            break_points_against = df_surface["break_points_against"].sum()
            break_points_against = df_surface["break_points_against"].sum()
            break_points_saved = df_surface["break_points_saved"].sum()
            service_games_won = df_surface["service_games_won"].sum()
            games_won = df_surface["games_won"].sum()
            games_against = df_surface["games_against"].sum()
            aces = df_surface["aces"].sum()

            first_serve_made_perc = div_or_zero(first_serve_made, (first_serve_made + first_serve_attempted))
            tie_breaks_won_perc = div_or_zero(tiebreaks_won, tiebreaks_total)
            break_points_made_player_perc = div_or_zero(break_points_made , (break_points_made + break_points_attempted))
            break_points_made_opponent_perc = div_or_zero(break_points_against , (break_points_saved + break_points_against))
            break_points_saved_player_perc = div_or_zero(break_points_saved , (break_points_against + break_points_against))
            service_games_won_perc = div_or_zero(service_games_won , ((games_won + games_against) / 2))
            return_games_won_perc = div_or_zero((games_won - service_games_won) , (games_won + games_against))
            aces_to_total_serves = div_or_zero(aces, (first_serve_attempted + first_serve_made))
            aces_to_serves_made = div_or_zero(aces, first_serve_made)

            row = {
                "player_id": player_id,
                "court_surface": surface,
                "first_serve_made_perc": first_serve_made_perc,
                "tie_breaks_won_perc": tie_breaks_won_perc,
                "break_points_made_player_perc": break_points_made_player_perc,
                "break_points_made_opponent_perc": break_points_made_opponent_perc,
                "break_points_saved_player_perc": break_points_saved_player_perc,
                "service_games_won_perc": service_games_won_perc,
                "return_games_won_perc": return_games_won_perc,
                "aces_to_total_serves": aces_to_total_serves,
                "aces_to_serves_made": aces_to_serves_made
            }
            rows.append(row)

        df_result = pd.DataFrame(rows)
        df_result.to_csv("diverging_data_players.csv")


def process_bollekes_data():

    a = None
    # 10 last matches of player
    for player_id in player_ids:
        x = df[df["player_id"] == "novak-djokovic"]
        x = df.sort_values(by="end_date", ascending=False)
        x = x.tail(10)
        print(x)
        a = x

    df = pd.read_csv("betting_moneyline.csv")

    # TODO: sum per bookmaker
    # for player_id in player_ids:
    #     x = df[df["team1"] == player_id]

    #     opponent_ids = x["team2"]
    #     odds = x["odds1"]

# Moneyline betting: favourite i.e. -150
def generateAverageBettingOdds(id):
    df = pd.read_csv("betting_moneyline.csv")
    avg_w_o = 0.0
    w_counter = 0
    avg_l_o = 0.0
    l_counter = 0
    
    
    x = df[df["team1"] == id]
    for index, row in x.iterrows():
        if row["price1"] < row["price2"]:
            avg_w_o += row["odds1"]
            w_counter += 1
        else:
            avg_l_o += row["odds1"]
            l_counter += 1
   
    
    x = df[df["team2"] == id]
    for index, row in x.iterrows():
        if row["price2"] < row["price1"]:
            avg_w_o += row["odds2"]
            w_counter += 1
        else:
            avg_l_o += row["odds2"]
            l_counter += 1
            
    avg_w_o = avg_w_o/w_counter
    avg_l_o = avg_l_o/l_counter     
            
    return (avg_w_o,avg_l_o)

def generateLastFiveGamesWithOdds(id):
    dfm = pd.read_csv("all_matches_filtered.csv")
    dfo = pd.read_csv("betting_moneyline.csv")
    """
        data = [
            { sequence: 1, odd: 0.48, win: true },
            { sequence: 2, odd: 0.98, win: false },
            { sequence: 3, odd: 1.5, win: true },
            { sequence: 4, odd: 0.87, win: false },
            { sequence: 5, odd: 3.21, win: true }
        ]
    """
    d = []
    
    # Steps: 1) get 5 most recent games {all_matches} 2) find corresponding odds {betting_moneyline}
    x1 = dfm[dfm["player_id"] == id].sort_values("start_date", ascending=False).head(50)
    x2 = dfm[dfm["opponent_id"] == id].sort_values("start_date", ascending=False).head(50)
    
    # 5 most recent games
    x = x1.merge(x2, how="outer").sort_values("start_date", ascending=False)
    
    nan_counter = 0
    
    # Find corresponding odds
    # After finding corresponding odds, take average of multiple bookies 
    for index, row in x.iterrows():
        if nan_counter < 5:
            if row["player_id"] == id:
                odd = dfo[
                            (dfo["start_date"] == row["start_date"]) & 
                            (dfo["team1"] == row["player_id"]) & 
                            (dfo["team2"] == row["opponent_id"])
                         ]
                odd = (odd["odds1"].mean(), True if row["player_victory"] == "t" else False)
            else:
                odd = dfo[
                            (dfo["start_date"] == row["start_date"]) & 
                            (dfo["team2"] == row["player_id"]) & 
                            (dfo["team1"] == row["opponent_id"])
                         ]
                odd = (odd["odds2"].mean(), True if row["player_victory"] == "f" else False)
            if not math.isnan(odd[0]):
                nan_counter += 1
                d.append({
                    "sequence": nan_counter,
                    "odd": round(odd[0],2),
                    "win": odd[1]
                    })
        else: break
    return d
    

def generateOverviewData():
    # From filtered matches, count nb of games per player
    df = pd.read_csv("all_matches_filtered.csv")

    players_countries = process_all_players()

    player_ids = map(name_to_id, top_players)
    rank_player_id_tuple_list = list(enumerate(player_ids, start=1))
    for (rank, id) in rank_player_id_tuple_list:
        
        player_name = id_to_name(id)        
        player_country = players_countries[players_countries["player_id"] == id].iloc[0]["country"]
        

        
        x = df[df["player_id"] == id]
        
        #games played
        nb_g = len(x)
        
        #games won
        nb_g_w = 0
        for index, row in x.iterrows():
            nb_g_w += 1 if (row["sets_won"] > row["num_sets"] - row["sets_won"]) else 0
        
        #tournaments played
        nb_t = x.groupby("tournament")["year"].nunique().sum()

        #average winning and losing odds
        avg_w_o, avg_l_o = generateAverageBettingOdds(id)        

        #last five games odds
        five_game_odds = generateLastFiveGamesWithOdds(id)
        
        print("{\"name\": \"", player_name, "\"",
              ", \"id\": \"", id, "\"",
              ", \"countryCode\": \"", player_country.lower(), "\"",
              ", \"gamesPlayed\": ", str(nb_g),
              ", \"gamesWon\": ", str(nb_g_w), 
              ", \"tournamentsPlayed\": ", str(nb_t),
              ", \"averageWinningOdd\": ", str(round(avg_w_o,2)),
              ", \"averageLosingOdd\": ", str(round(avg_l_o, 2)),
              ", \"lastFiveGamesOdds\": ", five_game_odds,
              "},")

def printJSON():
    print("[")
    generateOverviewData()
    print("]")
    
# process_all_matches()
# process_all_players()
# process_diverging_data_all()
# process_diverging_data_players()
# process_bollekes_data()
# generateOverviewData()
printJSON()