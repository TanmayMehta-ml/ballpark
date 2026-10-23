# BallPark

Guesstimate practice for consulting interviews, built around India. One question a day, a research team that gives you three clues, and a score for how close your number lands to the acceptable range. Runs in the browser and as an Android app from one codebase.

## What is in it
- **Daily challenge**: strictly one new question per day, with a streak, XP and diamonds.
- **Research team**: each question has about 15 data requests; you can unlock 3. They are clues, not answers.
- **Solutions**: step-by-step math, assumptions, a sanity check, and your answer on a log-scale range bar.
- **Past**: every answered question with its full solution.
- **Learn**: 10 modules from easy to hard with quizzes, plus a searchable India data cheat sheet.
- **Sound**: synthesised soft ambient music and click/hint/result effects (no audio files). Music and effects have their own on/off and volume in Settings.
- **Reminders** (Android app): two notifications a day, around 3 pm and 10 pm, picked at random from 12 messages and scheduled two weeks ahead. Today's are skipped once the daily question is solved. Turn them on or off in Settings.
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
