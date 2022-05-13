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
    filtered = df[df["player_id"].isin(player_ids)]
    # print(filtered)

    ranks = []
    for id in filtered["player_id"].to_list():
        ranks.append(dict[id])

    # TODO: add ranks to df
    # TODO: write to csv
    print(ranks)

    return

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
    df = pd.read_csv("all_matches_filtered.csv")

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

# process_all_matches()
# process_all_players()
# process_diverging_data_all()
# process_diverging_data_players()
process_bollekes_data()