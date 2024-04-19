
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
from spotipy.oauth2 import SpotifyOAuth
import pandas as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler
from sklearn.preprocessing import StandardScaler
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import OneHotEncoder
import os
import json
import sys

script_dir = os.path.dirname(__file__) #<-- absolute dir the script is in
#rel_path = "data\\train.csv"
rel_path = "data\\spotify_data.csv"
abs_file_path = os.path.join(script_dir, rel_path)

c = input()
json_data = json.loads(c)

#client_id = json_data['client_id']
#client_secret = json_data['client_secret']
playlist_personal = json_data['playlist_id']

#client_credentials_manager = SpotifyClientCredentials(client_id=client_id, client_secret=client_secret)
token = json_data['token']
sp = spotipy.Spotify(auth=token)

def spotify_dataset():
    spotify_df = pd.read_csv(abs_file_path)
    spotify_df = spotify_df.drop(columns=['Unnamed: 0', 'album_name', 'artists', 'explicit', 'popularity'])
    spotify_df.rename(columns = {'track_id':'id', 'track_name': 'track_names', 'track_genre' : 'genre'}, inplace = True) 
    spotify_df = spotify_df.iloc[:,[3,4,5,6,7,8,9,10,11,12,13,0,2,14,1,15]]
    spotify_df = spotify_df.astype({'key': object, 'instrumentalness': object})
    return spotify_df

def spotify_dataset2():
    spotify_df = pd.read_csv(abs_file_path)
    spotify_df = spotify_df.drop(columns=['Unnamed: 0', 'artist_name', 'popularity', 'year'])
    spotify_df.rename(columns = {'track_id':'id', 'track_name': 'track_names'}, inplace = True) 
    spotify_df = spotify_df.iloc[:,[3,4,5,6,7,8,9,10,11,12,13,1,14,15,0,2]]
    spotify_df = spotify_df.astype({'key': object, 'instrumentalness': object})
    return spotify_df

# Define a function for extracting and processing playlists
def feature_extract(plist1, genre=False):
    """ 
    Extracts a pandas playlist based on the desired audio features from a spotify playlist input
    'danceability',  'energy', 'key', 'loudness', 'mode', 'speechiness', 
    'acousticness', 'instrumentalness', 'liveness',
    'valence', 'tempo', 'type', 'id', 'uri', 'track_href',
    'analysis_url', 'duration_ms', 'time_signature'
    if true is specified then 'genre' is also extracted
    """
    playlist_link = "https://open.spotify.com/playlist/"+plist1
    playlist_URI = playlist_link.split("/")[-1].split("?")[0]

    #track_uris = [x["track"]["uri"] for x in sp.playlist_tracks(playlist_URI)["items"]]
    
    #Define the Playlist variable
    p_list=pd.DataFrame(columns=['danceability',  'energy', 'key', 'loudness', 'mode', 'speechiness', 'acousticness', 'instrumentalness', 'liveness',
    'valence', 'tempo', 'type', 'id', 'uri', 'track_href', 'analysis_url', 'duration_ms', 'time_signature'])
    
    
    #Extract data from the selected playlist
    # it is important to note that i left the original code for extracting information
    # However in this implementation I am only going to extract audio features for the return frame
    # This code could be further modified to return more data
    
    track_list=[]
    track_genre=[]

    track_items = sp.playlist_items(playlist_URI, fields=None, limit=100, offset=0, market=None, additional_types=('track', 'episode'))
    for track in track_items["items"]:
         #URI
        track_uri = track["track"]["uri"]
    
        #Track name
        track_name = track["track"]["name"]
        track_list.append(track_name)
        
         #Main Artist
        artist_uri = track["track"]["artists"][0]["uri"]
        artist_info = sp.artist(artist_uri)
    
        #Name, popularity, genre
        artist_name = track["track"]["artists"][0]["name"]
        artist_pop = artist_info["popularity"]
        artist_genres = artist_info["genres"]
        if genre==True:
             track_genre.append(artist_genres)

        if [] in track_genre:
            genre = False
            
        #Album
        album = track["track"]["album"]["name"]
    
        #Popularity of the track
        track_pop = track["track"]["popularity"]
        
        #Audio features - this will be extracted
        temp_list=sp.audio_features(track_uri)
        my_favs_temp=pd.DataFrame(temp_list, columns=['danceability',  'energy', 'key', 'loudness', 'mode', 'speechiness', 'acousticness', 'instrumentalness', 'liveness',
        'valence', 'tempo', 'type', 'id', 'uri', 'track_href', 'analysis_url', 'duration_ms', 'time_signature'])
        p_list=pd.concat([my_favs_temp, p_list], axis=0) # add together each frame per iteration
        p_list.reset_index(drop=True, inplace=True)
        
    #Create the track list
    
    track_names=pd.DataFrame(track_list, columns=['track_name'])
    track_names=track_names[::-1].reset_index(drop=True)
    
    #Create the Genres list if applicable
    if genre==True:
        track_genere2= [item[0] for item in track_genre] # loop extracts only the first genre element
        genre_names=pd.DataFrame(track_genere2, columns=['genre'])
        genre_names=genre_names[::-1].reset_index(drop=True) #reverse the list order
        
    #Add columns to the return list
    p_list['track_names']=track_names['track_name']
    #If we have included genres then we need to Hot Encode them and concat to the return list
    if genre==True:
        p_list['genre']=genre_names['genre']
    return p_list, genre

def create_similarity_score(df1,df2,similarity_score = "cosine_sim"):
    """ 
    Creates a similarity matrix for the audio features of two Dataframes.
    Parameters
    ----------
    df1 : DataFrame containing danceability, energy, key, loudness,	mode, speechiness, acousticness, instrumentalness,
    	liveness, valence, tempo, id, track_name, and if specified hot encoded genre
    df2 : DataFrame containing danceability, energy, key, loudness,	mode, speechiness, acousticness, instrumentalness,
    	liveness, valence, tempo, id, track_name, and if specified hot encoded genre
    
    similarity_score: similarity measure (linear,cosine_sim)
    
    Returns
    -------
    A matrix of similarity scores for the audio features of both DataFrames.
    """
    
    features = list(df1.columns)
    features.remove('id') #remove Id since it is not a feature
    features.remove('track_names') #remove Id since it is not a feature
    df_features1,df_features2 = df1[features],df2[features]
    #print(df_features1.dtypes)
    #print(df_features2.dtypes)
    df_features1.columns = df_features1.columns.astype(str)
    df_features2.columns = df_features2.columns.astype(str)
    
    scaler = StandardScaler() #Scale the data for input into the similarity function
    df_features_scaled1,df_features_scaled2 = scaler.fit_transform(df_features1),scaler.fit_transform(df_features2)
    if similarity_score == "linear":
        linear_sim = linear_kernel(df_features_scaled1, df_features_scaled2)
        return linear_sim
    elif similarity_score == "cosine_sim":
        cosine_sim = cosine_similarity(df_features_scaled1, df_features_scaled2)
        return cosine_sim

def genre_encode(plist):
    """
    Takes a feature extracted data frame with a genre column and hot encodes it with 
    the OneHotEncoder function
    
    Returns a fame of columns containing the numerical data
    """
    
    # initiate the encoder
    OH_encoder=OneHotEncoder(handle_unknown='ignore', sparse_output=False)
    #Distill each list to the genre columns
    Genre_List=plist['genre']
    Genre_Reshape=Genre_List.values.reshape(-1,1) #This is important becuase of the way the Encoder expects the input.
    OH_genre=pd.DataFrame(OH_encoder.fit_transform(Genre_Reshape))
    OH_genre.index = Genre_List.index #re-index extracted Hot Encoding
    # return_frame = pd.concat([OH_genre, plist], axis=1)
    return OH_genre # return the Hot Encoded Column

def recommend_tracks(plist1,plist2, genre=False): 
    """
    Takes the processed data frames from the feature extract function cleans the data to be only the
    numerical columns and then feeds the numerical frame into the similarity function.
    
    Return
    A dataframe of recommendations with track name and id

    """
    # if we added genres then we need to Hot Encode them and combine them with the return dataframe
    # we also need to drop the features we are not encoding
    if genre==True:
        oh_list1=genre_encode(plist1)
        oh_list2=genre_encode(plist2)
        plist1=plist1.drop(['type','uri','track_href','analysis_url','duration_ms', 'time_signature','genre'],axis=1)
        plist2=plist2.drop(['duration_ms', 'time_signature','genre'],axis=1)
        Track_Input = pd.concat([oh_list1, plist1], axis=1)
        Track_Input_compare = pd.concat([oh_list2, plist2], axis=1)
    else:
        Track_Input=plist1.drop(['type','uri','track_href','analysis_url','duration_ms', 'time_signature'],axis=1)
        Track_Input_compare=plist2.drop(['duration_ms', 'time_signature', 'genre'],axis=1)
        
    #create similarity scoring between playlist and recommendations
    similarity_score = create_similarity_score(Track_Input,Track_Input_compare)
    
    #get filtered recommendations
    final_recomms = Track_Input_compare.iloc[[np.argmax(i) for i in similarity_score]]
    final_recomms = final_recomms.drop_duplicates()
    
    #filter again so tracks are not already in playlist_df
    final_recomms = final_recomms[~final_recomms["id"].isin(Track_Input["id"])]
    final_recomms.reset_index(drop = True, inplace = True)
    #trim the results to id and track name
    final_recomms_return = final_recomms.loc[:, ['track_names','id']]
    return final_recomms_return

def Spotify_AI(playlist_personal, genre_in=False):
    my_favorites,genre_exists=feature_extract(playlist_personal, genre=genre_in) #my favorite as a dataframe
    results=recommend_tracks(my_favorites,spotify_df, genre=genre_exists)
    return results

spotify_df = spotify_dataset2()
recommendations = Spotify_AI(playlist_personal,True)
recommendations_id_list = recommendations['id'].tolist()
print(json.dumps(list(recommendations_id_list)))
sys.stdout.flush()