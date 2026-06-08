# Passpoint Quick Start - WordPress Handoff

This folder contains WordPress-ready options for embedding the Passpoint Quick Start Guide draft on the WBA WordPress site.

## Recommended Option: Custom HTML Block

Use this when the WBA team can edit a page and paste custom HTML.

1. Open the target WordPress page.
2. Add a `Custom HTML` block.
3. Paste the contents of `wordpress-iframe-embed.html`.
4. Preview the page and confirm the iframe height adjusts when accordions expand.

This option embeds the hosted guide:

`https://wifivomfranman.github.io/passpoint-quick-start-guide/`

The snippet includes a small `postMessage` listener so the iframe can resize when users expand or collapse sections.

## Fallback Option: No JavaScript Iframe

Use `wordpress-iframe-no-script.html` if WordPress strips scripts or the WBA site policy does not allow inline JavaScript.

Tradeoff: the iframe uses a fixed height, so users may see internal scrolling on smaller screens.

## Optional Option: Shortcode Plugin

Use the plugin in `wordpress-plugin/passpoint-quick-start-embed.php` if WBA prefers reusable WordPress shortcodes.

1. Create a folder named `passpoint-quick-start-embed` in `wp-content/plugins/`.
2. Add `passpoint-quick-start-embed.php` to that folder.
3. Activate `Passpoint Quick Start Embed` in WordPress Admin.
4. Add this shortcode to any page:

```text
[passpoint_quick_start]
```

Optional custom height:

```text
[passpoint_quick_start height="1500"]
```

## Production Recommendation

For WBA production, the cleanest approach is to host the static guide bundle on a WBA-controlled URL and update the iframe `src` to that WBA URL. That avoids relying on a personal GitHub Pages domain while preserving the simple WordPress embed workflow.

## Files

- `wordpress-iframe-embed.html` - preferred Custom HTML block snippet with auto-height.
- `wordpress-iframe-no-script.html` - fixed-height fallback snippet.
- `wordpress-plugin/passpoint-quick-start-embed.php` - optional shortcode plugin.
