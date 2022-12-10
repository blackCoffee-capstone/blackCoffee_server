import sys
from query import Query

file = read(.env.integ)

host = sys.argv[1] 
dbname = sys.argv[2]
user = sys.argv[3]
password = sys.argv[4]
port = sys.argv[5]

our_query = Query(
    host,
    db_name,
    spot_table_name,
    rank_table_name,
    post_table_bname,
    user,
    password,
    first_week_startdate,
    port
)



print(our_query.get_statistics_by_weeks(1, 3))
print(our_query.calculate_trend_rank(1, 3))
