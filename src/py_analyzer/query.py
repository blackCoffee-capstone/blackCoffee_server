import psycopg2
from sklearn.linear_model import LinearRegression

import sys
import copy
import datetime
## pip install pyscopg2-binary

class Query():

    def __init__(
        self,
        host : str,
        db_name : str,
        spot_table_name: str,
        rank_table_name: str,
        post_table_name: str,
        user : str,
        password : str,
        first_week_startdate : datetime.datetime,
        port : str = None
    ) -> None:
        self.host = host
        self.db_name = db_name
        self.spot_table_name = spot_table_name
        self.rank_table_name = rank_table_name
        self.post_table_name = post_table_name
        self.user = user
        self.password = password
        self.port = port
        self.first_week_startdate = first_week_startdate
        

    def _datetime_of_start_of_week(
        self,
        weeknumber : int = 0
    ) -> datetime.datetime:  
        week_start_date = self.first_week_startdate + datetime.timedelta(days = weeknumber*7)
        return week_start_date


    def _get_spots_weekly_likes(
        self,
        week_start_date : datetime
    ) -> tuple:
        if week_start_date.weekday() != 0:
            raise Exception("Non Monday Date Error")
        
        try:
            connection = psycopg2.connect(
                host = self.host,
                dbname = self.db_name,
                user = self.user,
                password = self.password,
                port = self.port
            )
            cursor = connection.cursor()
        except:
            connection = None
            cursor = None
            raise Exception("No DB connection err")
        
        week_end_date = week_start_date + datetime.timedelta(days = 7)

        query_string = f"FROM {self.post_table_name} GROUP BY spotId WHERE created_at BETWEEN({week_start_date} AND {week_end_date}) SELECT spot_name, spot_id, sum(likes)"
        cursor.execute(query_string)

        SpotWeeklyStatistics = cursor.fetchall()
        cursor.close()
        connection.close()
        
        return SpotWeeklyStatistics


    def _process_weekly_likes(
        self,
        weekly_statistics : dict,
        week_index : int,
        weekly_likes : tuple
    ) -> dict:
        for row in weekly_likes:
            spot_name = row[0]
            spot_id   = row[1]
            likes     = row[2]

            if spot_id in weekly_statistics:
                weekly_statistics[spot_id][week_index] = likes

            else : 
                weekly_statistics[spot_id] = {
                    week_index : likes
                }

        return weekly_statistics


    def _fill_in_blank_week(
        self,
        start_week : int,
        end_week :int,
        weekly_statistics : dict
    ) : 
        for spot_id in weekly_statistics:
            for week_index in range(start_week, end_week+1):
                if week_index in weekly_statistics[spot_id]:
                    continue
                else :
                    weekly_statistics[spot_id][week_index] = 0
        
        return weekly_statistics


    def get_statistics_by_weeks(
        self,
        start_week :int,
        end_week : int,
    ):  
        week_start_date_list = []
        
        for week_idx in range(start_week, end_week+1):
            week_start_date_list.append(self._datetime_of_start_of_week(week_idx))

        weekly_statistics = {}

        week_index = start_week
        for week_start_date in week_start_date_list:
            weekly_likes = self._get_spots_weekly_likes(week_start_date)
            self._process_weekly_likes(weekly_statistics, week_index, weekly_likes)
            week_index = week_index + 1
      
        self._fill_in_blank_week(start_week, end_week, weekly_statistics)
        """
        weekly_statistics = {
            0 : {          ## spot_id
                1 : 122,         ## week : likes
                2 : 0,           ## week : likes
                3 : 1445         ## week : likes
            },

            1 : {
                1 : 0,
                2 : 0,
                3 : 12
            }
        }
        """
        
        return weekly_statistics


    def _spot_like_linear_regression(
        self,
        spot_weekly_statistics : dict
    ) -> LinearRegression:
        """
        spot_weekly_statistics
        {
            1 : 0,
            2 : 123,
            3 : 1222,
        }
        """
        X = []
        y = []
        for week, likes in spot_weekly_statistics.items():
            X.append([week])
            y.append([likes])
        
        model = LinearRegression()
        model.fit(X = X, y = y)
        
        return model


    def _sort_spot_id_by_regression_model(
        self,
        weekly_statistics: dict
    ) -> dict:
        
        spots_and_models = {}
        for spot_id, spot_weekly_statistics in weekly_statistics.items():     
            spots_and_models[spot_id] = self._spot_like_linear_regression(spot_weekly_statistics)
        
        """
        spots_and_models
        {
            0 : regression_model,
            1 : regression_model,
            2 : regression_model,
            ...
        }
        """
        
        ##TODO:
        ## Implement Sorting with model's feature
        sorted = dict(sorted(spots_and_models.items(), key = lambda item : item[1] ))
        sorted_spot_ids_with_rank = {}
        
        rank = 1
        for spot_id in sorted:
            sorted_spot_ids_with_rank[spot_id] = rank
            rank = rank + 1 
        """
        sorted_spot_ids_with_rank
        {
            #spot_id: rank,
            0 : 1,
            4 : 2,
            2 : 3,
            8 : 4,
            ...
        }
        """
        return sorted_spot_ids_with_rank


    def _sort_spot_id_by_likes(
        self,
        weekly_statistics : dict
    ) -> dict:

        spots_likes = {}
        for spot_id, spot_weekly_statistics in weekly_statistics.items():
            copy_of_spot_weekly_statistics = copy.copy(spot_weekly_statistics)
            week, likes = copy_of_spot_weekly_statistics.popitem()

            spots_likes[spot_id] = likes

        sorted = dict(sorted(spots_likes.items(), key = lambda item : item[1] ))
        sorted_spot_ids_with_rank = {}
        
        rank = 1
        for spot_id in sorted:
            sorted_spot_ids_with_rank[spot_id] = rank
            rank = rank + 1
        
        return sorted_spot_ids_with_rank

    def _sort_spot_id_by_buzz(
        self,
        weekly_statistics : dict
    ) -> dict:
        sorted_spot_ids_with_rank = {}
        
        spots_true_minus_pred = {}
        for spot_id, spot_weekly_statistics in weekly_statistics.items():
            
            copy_of_spot_weekly_statistics = copy.copy(spot_weekly_statistics)
            final_week, true_likes = copy_of_spot_weekly_statistics.popitem()
            regression_model = self._spot_like_linear_regression(copy_of_spot_weekly_statistics)
            predicted_likes = regression_model.predict([final_week])
            
            likes_error = true_likes - predicted_likes
            spots_true_minus_pred[spot_id] = likes_error
        

        sorted = dict(sorted(spots_true_minus_pred.items(), key = lambda item : item[1] ))
        sorted_spot_ids_with_rank = {}
        
        rank = 1
        for spot_id in sorted:
            sorted_spot_ids_with_rank[spot_id] = rank
            rank = rank + 1

        """
        sorted_spot_ids_with_rank
        {
            #spot_id: rank,
            0 : 1,
            4 : 2,
            2 : 3,
            8 : 4,
            ...
        }
        """
        return sorted_spot_ids_with_rank


    def calculate_trend_rank(
        self,
        start_week : int,
        end_week : int
    ):
        if end_week - start_week == 1:
            ## Not Enough data for actual trend analysis
            ## Sort Rank by gradient of Linear Regression Model
            weekly_statistics = self.get_statistics_by_weeks(start_week, end_week)
            sorted_spot_ids_with_rank = self._sort_spot_id_by_regression_model(weekly_statistics)

            return sorted_spot_ids_with_rank
        
        elif end_week - start_week == 0:
            ## Not Enough Data for Linear Regression 
            ## Sort Rank by Like Number
            weekly_statistics = self.get_statistics_by_weeks(start_week, end_week)
            sorted_spot_ids_with_rank = self._sort_spot_id_by_likes(weekly_statistics)
        
        elif end_week - start_week  < 0:
            raise Exception("end_week must be larger int than start_week")

        else :
            previous_weekly_statistics = self.get_statistics_by_weeks(start_week, end_week)
            sorted_spot_ids_with_rank = self._sort_spot_id_by_buzz(weekly_statistics)


        without_new_data_linear_regression_models = {}
        
        for spot_id in previous_weekly_statistics:
            self._spot_like_linear_regression
        

        return

    def register_to_trend_rank_table(
        self,
        start_Week : int,
        end_week : int,
    ) -> None:
        None
