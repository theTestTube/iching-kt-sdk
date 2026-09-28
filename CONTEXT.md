# CONTEXT.md

Domain vocabulary of the SDK. It is a glossary, not a guide: each term names what the code means by
it and where the code defines it.

**Rights rule for this file.** This repository is MIT and its license covers documentation. So this
file holds only structural facts (characters, pinyin, Unicode, binaries, numbering, time ranges),
which are not copyrightable and can be checked against `packages/data-hexagrams`, plus the project's
own epithets. It quotes no translation. The rights status of each shipped text is in the file
headers of `packages/data-hexagrams/src/` (#197).

## Framework

- **Knowlet**: a pluggable module that renders one view of I-Ching knowledge. It declares the output
  types it `consumes` and `produces` (`packages/core/src/types.ts`).
- **Situation provider**: a source of the current situation (time, solar time, location, rotation,
  moon phase) that knowlets consume (`packages/provider-*`).
- **Output type**: the typed value that flows between knowlets: `time`, `gps`, `rotation`,
  `hexagram`, `trigram`, `yinyang`, `element`, `animal`. A knowlet emits with
  `context.emitOutput(type, value)` and receives through `context.inputData`.

## Structure

- **Line**: yang (solid, `1`) or yin (broken, `0`).
- **Trigram** (卦, three lines): eight of them, identified by `TrigramId`. The `binary` of a trigram
  reads **bottom to top** (`packages/data-hexagrams/src/trigrams.ts`). No numbering is assigned,
  because no trigram numbering is universally accepted.
- **Hexagram** (卦, six lines): 64 of them, numbered 1–64 in the **King Wen sequence** (the received
  order of the Zhouyi). The `binary` of a hexagram reads **top to bottom**: it is the reverse of
  `lower.binary + upper.binary` (`packages/data-hexagrams/src/hexagrams.ts`). A test checks this for
  all 64.
- **Unicode**: trigrams ☰–☷ (U+2630–U+2637); hexagrams ䷀–䷿ (U+4DC0–U+4DFF) in King Wen order, so
  hexagram *n* is U+4DC0 + *n* − 1.

### Trigrams

| Id | Symbol | Chinese | Pinyin | Binary (bottom→top) | Image | EN epithet | ES epithet |
|----|--------|---------|--------|---------------------|-------|------------|------------|
| heaven | ☰ | 乾 | qián | 111 | 天 heaven | Creative | Lo Creativo |
| earth | ☷ | 坤 | kūn | 000 | 地 earth | Receptive | Lo Receptivo |
| thunder | ☳ | 震 | zhèn | 100 | 雷 thunder | Inciting | Lo Incitante |
| water | ☵ | 坎 | kǎn | 010 | 水 water | Abysmal | Lo Abismal |
| mountain | ☶ | 艮 | gèn | 001 | 山 mountain | Stillness | La Quietud |
| wind | ☴ | 巽 | xùn | 011 | 風 wind | Gentle | Lo Suave |
| fire | ☲ | 離 | lí | 101 | 火 fire | Clinging | Lo Adherente |
| lake | ☱ | 兌 | duì | 110 | 澤 lake | Cheerful | Lo Alegre |

**Provenance of the epithets.** The images come from the Shuogua 說卦 (public domain). The epithets
are the project's own renderings. Where one coincides with the literal rendering of Richard
Wilhelm's German *I Ging* (1924, public domain), that German is its basis. The distinctive choices
of the later English (1950) and Spanish (1975) translations of that German, both in copyright, are
not used. That is why the SDK ships Inciting / Lo Incitante, Stillness / La Quietud and Cheerful /
Lo Alegre. (Spanish is listed here because the data ships it; this file stays English.)

## Translation keys

Hexagram texts are keyed `${language}-${source}` (`packages/data-hexagrams/src/types.ts`):

| Key | Basis |
|-----|-------|
| `en-legge` | James Legge, *The Yi King* (1882, public domain) |
| `es-legge` | Project translation into Spanish from Legge |
| `es-zhouyi` | Project translation into Spanish from the Chinese |
| `zh-zhouyi` | The Zhouyi 周易 (classical Chinese, public domain) |

Defaults per language: `en` → legge, `es` → legge, `zh` → zhouyi
(`packages/core/src/translations.ts`). A stored preference for a source that has no shipped data
(for example `'wilhelm'`, stored before #197 removed it) resolves to the default. Wilhelm keys return
once they are re-derived from the 1924 German (#277).

## Time

- **Shichen** (時辰, double-hour): twelve two-hour periods named by the **earthly branches**
  (`packages/provider-time/src/index.ts`). The count starts at 子 zi, 23:00–01:00:

  | Branch | 子 zi | 丑 chou | 寅 yin | 卯 mao | 辰 chen | 巳 si | 午 wu | 未 wei | 申 shen | 酉 you | 戌 xu | 亥 hai |
  |---|---|---|---|---|---|---|---|---|---|---|---|---|
  | Starts | 23:00 | 01:00 | 03:00 | 05:00 | 07:00 | 09:00 | 11:00 | 13:00 | 15:00 | 17:00 | 19:00 | 21:00 |

  `provider-solar-time` evaluates the same ranges on mean solar time instead of civil time.
- **Sovereign hexagrams** (十二消息卦, "waxing and waning"): the twelve hexagrams of Han-dynasty
  guaqi 卦氣 doctrine (Meng Xi 孟喜, Jing Fang 京房), one per branch. Yang grows one line at a time
  from zi to si, then yin grows from wu to hai (`packages/data-hexagrams/src/sovereign.ts`):

  | Branch | zi | chou | yin | mao | chen | si | wu | wei | shen | you | xu | hai |
  |---|---|---|---|---|---|---|---|---|---|---|---|---|
  | Hexagram | 24 復 | 19 臨 | 11 泰 | 34 大壯 | 43 夬 | 1 乾 | 44 姤 | 33 遯 | 12 否 | 20 觀 | 23 剝 | 2 坤 |
  | Yang lines | 1 | 2 | 3 | 4 | 5 | 6 | 5 | 4 | 3 | 2 | 1 | 0 |
