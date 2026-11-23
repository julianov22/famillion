# Famillion

A daily game of 7 prompts about your family and friends. One play per day. The fewer people who give the same answer, the more points it scores:

- Only you said it: 3 points
- Two people said it: 2 points
- Three or more: 1 point

Small differences don't matter: "The Cancún!" and "cancun" count as the same answer. Translations do: "skiing" and "esquiar" count as different answers.

## How it's built

- `index.html`: the whole app. A static page, no build step.
- `game.js`: scoring, answer matching, and which prompts go with which day.
- `worlds.js`: the worlds a day is played in: the Swiss alpine descent and the Madrid metro. `SCHEDULE` and `DEFAULT_WORLD` in `index.html` pick the world by date. Add `?world=metro` to the URL to preview a world.
- `prompts.txt`: your prompt list.
- `schema.sql`: the database. Supabase's free tier hosts it.

Players join by typing their name. There are no passwords or emails: Supabase gives each device an anonymous account and remembers it. Each person should play from the same device every day.

## Setup (about 10 minutes)

1. **Create the database.** Make a free project at [supabase.com](https://supabase.com). Open **SQL Editor**, paste in `schema.sql`, and click **Run**.
2. **Turn on name-only sign-in.** Go to **Authentication → Sign In / Providers** and enable **Allow anonymous sign-ins**.
3. **Connect the app.** At the top of the `<script>` in `index.html`, fill in two values:
   - `SUPABASE_URL`: your project URL, like `https://<project-id>.supabase.co`, without `/rest/v1/`.
   - `SUPABASE_KEY`: the publishable key from **Project Settings → API Keys**. It starts with `sb_publishable_`. The legacy `anon` key also works. Never use the secret key.

   The publishable key is meant to be public; the database rules in `schema.sql` protect the data. The green **Connect** button at the top of the dashboard shows both values too.
4. **Set the start date and timezone.** In `index.html`, `START` is day 1 and `TZ` is the family's timezone. Days before `START` are practice rounds, for testing. If you change `TZ`, change it in `family_today()` in `schema.sql` too.
5. **Write your prompts** in `prompts.txt`, one per line, as `English | Español`. Players switch languages at the top of the page. Add new prompts at the bottom only.
6. **Publish it.** On GitHub go to **Settings → Pages**, choose **Deploy from a branch**, then `main` and `/ (root)`. The game goes live at `https://julianov22.github.io/famillion/`. Send that link to the family.

## Being the referee

If someone makes up an answer, open **Table Editor → answers** in Supabase and delete that row. Their score updates the next time anyone loads the results.

## Checks

```bash
npm test
```
