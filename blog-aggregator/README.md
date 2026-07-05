# Gator

TypeScript based CLI application for aggregating and browsing RSS feeds. Built
as part of the [Build a Blog Aggregator in TypeScript](https://www.boot.dev/courses/build-blog-aggregator-typescript) Boot.dev project.

## Project Setup

1. Initialize a PostgreSQL database named `gator`.
2. Create a config file in the home directory named `.gatorconfig.json`.

```json
{
  "db_url": "postgres://<username>:@localhost:5432/gator?sslmode=disable",
  "current_user_name": ""
}
```

3. Generate the SQL migration.

```sh
$ npm run generate
```

4. Run the SQL migration.

```sh
$ npm run migrate
```

## Usage

Register as a new user.

```sh
$ npm run start register <user_name>
```

Login as a registered user.

```sh
$ npm run start login <user_name>
```

List all registered users.

```sh
$ npm run start users
```

Register a new RSS feed.

```sh
$ npm run start addfeed <feed_name> <feed_url>
```

For example:

```sh
$ npm run start addfeed "Hacker News" https://hnrss.org/newest
```

List all registered RSS feeds.

```sh
$ npm run start feeds
```

Follow a registered feed.

```sh
$ npm run start follow <feed_url>
```

Unfollow a registered feed.

```sh
$ npm run start unfollow <feed_url>
```

List all feeds being followed.

```sh
$ npm run start following
```

Aggregate RSS feed posts. Specify the time between requests as `ms`, `s`, `m`, or `h`.

```sh
$ npm run start agg 30s
```

Browse recently aggregated posts. Defaults to 2 posts if limit not specified.

```sh
$ npm run start browse [<limit>]
```
