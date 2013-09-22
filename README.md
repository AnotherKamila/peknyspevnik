spevnik2: the second attempt at my awesome html5 songbook
=========================================================

This thing might one day become a neat, touch-friendly, and human-friendly songbook/sheet music organizer written as an HTML5 offline app.

**Update**: It's alive, and has its own domain! The latest build usually lives at [peknyspevnik.tk](http://www.peknyspevnik.tk) and may bite.

The Plan
--------

- it should have an almost paper-like feeling, at least in being minimal - no distractions
- it should make use of the fact that it is not paper (e.g. powerful search)
- it should be easy to use and convenient for both me and a less computer-savvy person
- it should work offline
- it should work across all devices with modern browsers

The current version of course can't do much — the last few days of hacking have been fun, but this thing is not at all ready for usage anyway. However, what works now is:

- adding songs from either files formatted like [this](http://anotherkamila.github.io/projects/spevnik/format_sample-batalion.txt) or by direct input into the form
- incremental search (author and title), works regardless of accents (by converting metadata and search query into ASCII) — unless it doesn't (currently supports only [these](https://github.com/AnotherKamila/spevnik2/blob/master/helpers/u2u.coffee#L6) hard-coded characters)
- if there is exactly 1 result, jumps straight to it
- current search/song is reflected in the nice, bookmarkable URL (fragment)

Note that it does not support older browsers (by design). Currently tested only on Chromium 28.0.1500.95 (Developer Build 213514) on Linux.

Notable things that don't work yet, but are planned:

- online songs database + easy import
- offline usage
- keyboard shortcuts
- better song display, including showing text of repeated stanzas indicated by their labels and showing how to play a chord when clicking on it
- transposing chords
- support for displaying other things besides lyrics with chords (notes, tabs, etc.)
- support for more/arbitrary metadata (via plugins)
- syncing view across devices (when there is a lot of people, manually syncing several computers to show the same thing becomes annoying)
- plugins

Extensible!
-----------

Even supposedly core parts (like displaying text/sheet music/guitar tabs) will actually be indistinguishable from 3rd-party plugins. Therefore, I will be forced to create a decoupled design, so it should be really easy to extend the functionality in just about any imaginable way. I would like to end up maintaining this and not hating this at the same time, so I'd better do this well :D

*Note:* The current state does not resemble this at all. I am planning to fix that at some point.

Why all this
------------

The main reason why I am doing this is that I want to (1) try to write a semi-serious web app, (2) learn about all the new html5 awesomeness and (3) get closer to becoming the Javascript Jedi I'd like to be.

License
-------

[MIT](http://opensource.org/licenses/MIT)
