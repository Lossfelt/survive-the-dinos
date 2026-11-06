# Stilprototype (kastes når stil er valgt)

**Spørsmål:** Hvilken visuell stil passer Survive the Dinos?

**Kjør:** `node prototype/stil/serve.mjs` og åpne http://localhost:5180/?variant=A. Bytt stil med piltastene eller knappene nederst. `C` åpner karakterarket. Hold musepekeren over kroppssoner og kartsteder for detaljer.

| Variant | Stil | Hvordan grafikken lages |
| --- | --- | --- |
| A | Pikselgrafikk | Sprites som tekstrutenett med palett, terreng fra støyfunksjon med Bayer-dithering, animert regn og lydring |
| B | Feltdagbok | SVG-streker med tilfeldig skjelving, tegnet to ganger for skisse-preg |
| C | Kolonistens terminal | Kart som tegnrutenett (ASCII), kropp som SVG-wireframe |

All grafikk er generert med kode. Ingen bildefiler.

**Svar (2026-11-06):** Pikselgrafikk (variant A) var klar favoritt. Feltdagbok og terminal var også gode forslag, men velges bort. Variant A videreutvikles her til kroppsfigur og ansikt sitter, deretter tas det inn i spillet og prototypen slettes. Forbedringspunktene står i [game-concept.md](../../game-concept.md) under «Visuell stil».
