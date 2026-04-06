# Poopidex — AI-Powered Scat Identification & Collector Game

Snap a photo of any dropping, it can be any animal, any ecosystem, even human, and get a collectible Poopidex card. Build your collection, battle your friends' cards, trade finds from different habitats, and complete the Poopidex. For the serious crowd, flip on Pro Mode for species ID, freshness estimates, health assessments, and a GPS-mapped scat log.

Gotta log 'em all.

---

## Modes

### Explorer Mode (Kids & Casual Users)

- Photograph any scat and instantly receive a Poopidex card: species name, fun nickname, rarity tier (Common → Legendary), and a stat block (Size, Smell, Danger, Freshness).
- Build a Pokédex-style collection grid and undiscovered species show as silhouettes.
- Challenge friends to card battles: pick a stat, highest number wins.
- Trade cards with other users to fill gaps in your Poopidex.

### Pro Mode (Hunters, Researchers, Vets, Pet Owners)

- Same AI ID engine, different output: freshness estimate, Bristol Stool Scale health note, scientific species note, conservation alert for rare/watch-listed species.
- GPS-mapped personal scat log with timestamp and AI notes.

---

## Stack

Next.js + Supabase + Claude Vision API, deployed on Vercel.

---

## Developer

**Joyce Zhou** — 40 GIX Bucks

---

## Timeline & Progress Check-ins


| Date               | Milestone              | Required Progress                                                                                                                              |
| ------------------ | ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| **April 12, 2026** | Architecture check-in  | Repo scaffolded, Supabase schema (4 tables) created, page routing skeleton in place, architecture PR submitted and reviewed                    |
| **April 26, 2026** | Core AI check-in       | Photo upload works end-to-end; AI returns species ID, rarity, stats, and flavor text; Poopidex card renders on screen                          |
| **May 15, 2026**   | Game features check-in | Poopidex collection grid functional (discovered/undiscovered state); card battle flow complete; card trading complete; Pro Mode toggle working |
| **June 1, 2026**   | Final delivery         | App deployed to public URL; auth in place; all 8 issues closed; README updated with live link                                                  |


---

## GitHub Issues

1. [Setup] Project scaffolding & tech stack
2. [UI] Photo capture & upload interface
3. [AI] Species ID & Poopidex card generation
4. [Feature] Poopidex collection view
5. [Feature] Card battles
6. [Feature] Card trading
7. [Feature] Pro Mode (freshness, health note, GPS log, conservation alert)
8. [Auth] User authentication

