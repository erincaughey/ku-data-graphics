library(tidyverse)

tweets <- read_csv("tweets_new.csv")

count_by_date <- tweets %>% group_by(created_at) %>% tally()

source_count <- tweets %>% group_by(source) %>% tally() 
source_count <- arrange(source_count, desc(n))
source_count <- slice(source_count, 1:15)

# Retweet True / False count
tf <- ggplot(tweets, aes(retweeted))
tf + geom_bar(fill = "#1DA1F2") +
  labs(x="Retweeted", y="Number of tweets", title="Retweets or original tweets?", subtitle="How many tweets of mine are retweeted from other accounts or original?", caption="Source: Tweets of @erin_caughey as of April 21 at 2 p.m.") +
  theme_minimal() +
  theme(
      plot.title = element_text(size = 18, face = "bold"),
      plot.subtitle = element_text(size=10),
      axis.text = element_text(size = 7),
      axis.ticks = element_blank()
    )

# Tweet source count
#source_count$n <- factor(source_count$n, levels = source_count$n[order(source_count$source)])
client <- ggplot(source_count, aes(x=reorder(source, n), y=n))
client + geom_bar(stat = "identity", fill = "#1DA1F2") + 
  labs(x="Platform", y="Tweets ", title="Where I tweet from", subtitle="The top 15 platforms I've tweeted from since 2009.", caption="Source: Tweets of @erin_caughey as of April 21 at 2 p.m.") +
  theme_minimal() + 
  theme(
    plot.title = element_text(size = 18, face = "bold"),
    plot.subtitle = element_text(size=10),
    axis.text = element_text(size = 7),
    axis.ticks = element_blank()
  ) +
  coord_flip()


# frequency timeseries
timeseries <- ggplot(data = count_by_date, aes(x = created_at, y = n)) + 
  geom_line(color = "#1DA1F2", size = 1)
timeseries + 
  labs(x="Date", y="Tweets per day ", title="Tweeting frequency", subtitle="How often I've tweeted every day since joining Twitter.", caption="Source: Tweets of @erin_caughey as of April 21 at 2 p.m.") +
  theme_minimal() +
  theme(
    plot.title = element_text(size = 18, face = "bold"),
    plot.subtitle = element_text(size=10),
    axis.text = element_text(size = 7),
    axis.ticks = element_blank()
  )

# barcode plot 
#plot(0, 0, xlim=range(count_by_date$created_at), ylim=c(0, 100), type="n")
#segments(x0=count_by_date$created_at, x1=count_by_date$created_at, y0=0, y1=100, col="#00000030")
#date_count <- ggplot(count_by_date, aes(created_at))
#date_count + geom_bar() + coord_flip()

ggsave("retweet.pdf", plot = tf, width = 7, height = 10, units = "in", dpi = 320)
ggsave("retweet.png", plot = tf, width = 7, height = 10, units = "in", dpi = 320)

ggsave("platform.pdf", plot = client, width = 17, height = 10, units = "in", dpi = 320)
ggsave("platform.png", plot = client, width = 17, height = 10, units = "in", dpi = 320)

ggsave("frequency.pdf", plot = timeseries, width = 7, height = 10, units = "in", dpi = 320)
ggsave("frequency.png", plot = timeseries, width = 7, height = 10, units = "in", dpi = 320)