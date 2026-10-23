# BallPark

Guesstimate practice for consulting interviews, built around India. One question a day, a research team that gives you three clues, and a score for how close your number lands to the acceptable range. Runs in the browser and as an Android app from one codebase.

## What is in it
- **Daily challenge**: strictly one new question per day, with a streak (an animated flame that changes colour at 10, 25, 50, 100, 200 and 300 days), XP and gems.
- **Scoring**: the acceptable range is split into three parts on a log scale. The middle third scores 100, the outer thirds 70, and misses fall off from there.
- **Research team**: each question has about 15 data requests; you can unlock 3. They are clues, not answers.
- **Solutions**: step-by-step math, assumptions, a sanity check, and your answer on a log-scale range bar.
- **Past**: every answered question with its full solution.
- **Learn**: 10 modules from easy to hard with quizzes, plus a searchable India data cheat sheet.
- **Sound**: synthesised soft ambient music and click/hint/result effects (no audio files). Music and effects have their own on/off and volume in Settings.
- **Reminders** (Android app): two notifications a day, around 3 pm and 10 pm, picked at random from 12 messages and scheduled two weeks ahead. Today's are skipped once the daily question is solved. Turn them on or off in Settings.
- **Shop**: spend gems on new animal avatars, profile borders, profile banners and streak freezes (1 day, 3 days, 1 week). Freezes cover missed days automatically.
- **Streak calendar**: tap the flame on Home to see every day you solved the daily, coloured by how the answer went (bullseye, in range, close, off, missed), plus freeze days.
- **Badges**: 23 badges on the Profile (7, 30 and 100-day streaks, a badge for each month Jan to Dec (solve 80% of its days inside the range; freeze days count), learning milestones, and skill badges).
- **Starred**: tap the star on any solution; find them under Past > Starred.
- **After each question**: a suggested Learn module that fits the question and how the answer went.
- Progress is stored on the device only. No login, no server.

## Develop
```bash
npm install
npm run dev          # normal build behaviour (daily lock on)
npm run dev:all      # dev mode: every question unlocked, replay allowed
npm run validate     # checks the question bank (schema, ranges, hints, step math)
npm test
```

### Dev mode (owner only)
Dev mode is a build-time flag, `VITE_DEV_MODE=true`, read from `.env.dev` (git-ignored, create it yourself). The public Pages site and the released APK are built without it, so the unlock is not in them.

## Android
The APK is built by GitHub Actions (`.github/workflows/android.yml`) when a `v*` tag is pushed, and attached to the GitHub Release. To build locally with Android Studio:
```bash
npm run android:sync
npx cap open android
```
For a dev-mode APK, run `npx vite build --mode dev` before `npx cap sync android`, and keep that APK to yourself.

## Add questions
Add JSON files to `src/data/questions/` using the schema in `src/types.ts`, then run `npm run validate`.
