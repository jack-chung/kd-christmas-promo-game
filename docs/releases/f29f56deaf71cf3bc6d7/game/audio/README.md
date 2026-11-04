# Wrap Station audio provenance

No modern song recording, lyrics or third-party arrangement is included. Melodies are transcribed as pitch/duration content in `../content.js`; harmony, voicing, kit patterns and charts are new arrangements for this game.

| Melody | Provenance |
| --- | --- |
| Deck the Halls / Nos Galan | Traditional Welsh air, printed in John Thomas's *Welsh Melodies* series (1862–74); the familiar English carol dates to 1862. [Historical publication details](https://www.hymnsandcarolsofchristmas.com/Hymns_and_Carols/deck_the_hall.htm). |
| O Christmas Tree / O Tannenbaum | Traditional German tune used for Ernst Anschütz's 1824 song; melody only, in our common-time arrangement. [National Records of Scotland](https://blog.nrscotland.gov.uk/2021/12/09/title-o-tannenbaum-the-root-of-a-christmas-tradition/). |
| Joy to the World / ANTIOCH | Lowell Mason (1792–1872), *The Modern Psalmist* (1839), p. 144: [publication catalogue](https://imslp.org/wiki/Joy_to_the_World_(Mason,_Lowell)). Complete soprano melody checked against [Mutopia's public-domain score source](https://www.mutopiaproject.org/ftp/HandelGF/antioch/antioch.ly), edition Mutopia-2008/01/13-1223 (Steve Dunlop). Transposed D to C, with doubled rhythmic values for our four-beat pulse. Only the melody is used; harmony and charts are our own. |
| Good King Wenceslas (Sorting Office) | Traditional “Tempus adest floridum” from *Piae Cantiones* (1582), checked against [Mutopia's public-domain edition](https://www.mutopiaproject.org/cgibin/piece-info.cgi?id=905) of Hutchins, *Carols Old and Carols New* (1916), no. 415. Our own G-major arrangement and three verse textures. |

## Carol rules for all games

Traditional public-domain melodies are allowed, including sacred carols and carols sung in the show. Examples include Joy to the World, O Little Town of Bethlehem, Hark! The Herald Angels Sing, O Come, All Ye Faithful, Angels We Have Heard on High, Go, Tell It on the Mountain, Away in a Manger and The First Noel. Arrange and chart them ourselves; never copy the musical's songs, arrangements or medleys, modern arrangements, lyrics or recordings.

Santa/reindeer songs (including Up on the Housetop and Jolly Old St. Nicholas) and Jingle Bells remain excluded. Bells are Tansy's gifts in the plot. No character mentions Jesus or teaches the meaning of Christmas, including through commentary on carols. The show-day finale text is unchanged and exempt. Sacred carol titles and melodies are fine.

These traditional melodies are public domain in Canada and the US. No Warrell or other modern carol arrangement is used.

## Every sound source

- Fold: recorded marimba, roots B3/F4/C5 (MIDI 59/65/72).
- Tape: recorded violin-section pizzicato, roots D4/A4/C5 (MIDI 62/69/72).
- Ribbon and quiet Easy fill: recorded concert harp, roots D4/A4 (MIDI 62/69).
- Bow: recorded glockenspiel, root G5 (MIDI 79), pitched to each chart note.
- Backing bass: recorded double-bass pizzicato, root C2 (MIDI 36).
- Backing chord stabs: the same harp and pizzicato samples, separately mixed below the player's line.
- Warm pad: original generated C4 sine fundamental plus a quiet second harmonic, attack/release envelope, transposed into chord voicings.
- Kick: original generated descending sine transient. Snare/shaker/count-in: original deterministically generated noise bursts with amplitude envelopes. No bell or sleigh-bell recording used.
- Non-Wrap cues: pre-existing original Web Audio synthesis, retained.

All recordings are from **VSCO 2 Community Edition**, Versilian Studios / Sam Gossner and contributors: [publisher and CC0 statement](https://versilian-studios.com/vsco-community/), [source repository](https://github.com/sgossner/VSCO-2-CE). Each original recording path and the immutable upstream revision are in `sources.json`. The complete upstream dedication is in `CC0-1.0.txt`. CC0 permits commercial use, modification and redistribution; no attribution obligation. We provide voluntary credits in `credits.html`, reachable from the game. No CC-BY assets are used.

## Processing and budget

10 WAV files, **642,224 bytes total** (0.642 MB decimal / 627.2 KiB), mono PCM16 at 22050 Hz. Fetch occurs only inside Wrap or Sorting Office; no CDN/runtime external requests. Manifest/credits/licence add about 12 KB. Leading silence below -60 dB is removed, recordings are capped at manifest durations, a 2 ms attack and final 80 ms fade are applied, and each file is peak normalized to -1 dB. Playback envelopes cap long transposed tails. Root pitches were checked against the recordings; upstream filenames use inconsistent octave conventions.

To reproduce, download each pinned source file in `sources.json`, use FFmpeg `silenceremove=start_periods=1:start_threshold=-60dB,atrim=duration=<seconds>,afade=t=in:d=0.002,afade=t=out:st=<seconds-.08>:d=0.08`, downmix/resample with `-ac 1 -ar 22050`, measure `volumedetect`, then apply constant gain to reach -1 dB peak. Preserve WAV PCM16 output. Source files remain upstream; only processed excerpts are bundled.

Mix gains and the compressor are in `../music.js`. OfflineAudioContext checks establish an audible backing floor, melody RMS above backing and peak headroom. Listening on actual phone speakers remains the acceptance check for timbre, balance and recognisability.
