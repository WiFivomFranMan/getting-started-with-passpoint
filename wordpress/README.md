# Getting Started with Passpoint - WordPress Handoff

This folder contains WordPress-ready options for embedding the **Getting Started with Passpoint** guide draft on the WBA WordPress site.

## Recommended Option: Custom HTML Block

Use this when the WBA team can edit a page and paste custom HTML.

1. Open the target WordPress page.
2. Add a `Custom HTML` block.
3. Paste the contents of `wordpress-iframe-embed.html`.
4. Preview the page and confirm the iframe height adjusts when accordions expand.

This option embeds the hosted guide:

`https://wifivomfranman.github.io/getting-started-with-passpoint/`

The snippet includes a small `postMessage` listener so the iframe can resize when users expand or collapse sections.

## Fallback Option: No JavaScript Iframe

Use `wordpress-iframe-no-script.html` if WordPress strips scripts or the WBA site policy does not allow inline JavaScript.

Tradeoff: the iframe uses a fixed height, so users may see internal scrolling on smaller screens.

## Optional Option: Shortcode Plugin

Use the plugin in `wordpress-plugin/getting-started-with-passpoint-embed.php` if WBA prefers reusable WordPress shortcodes.

1. Create a folder named `getting-started-with-passpoint-embed` in `wp-content/plugins/`.
2. Add `getting-started-with-passpoint-embed.php` to that folder.
3. Activate `Getting Started with Passpoint Embed` in WordPress Admin.
4. Add this shortcode to any page:

```text
[getting_started_with_passpoint]
```

Optional custom height:

```text
[getting_started_with_passpoint height="1500"]
```

## Production Recommendation

For WBA production, the cleanest approach is to host the static guide bundle on a WBA-controlled URL and update the iframe `src` to that WBA URL. That avoids relying on a personal GitHub Pages domain while preserving the simple WordPress embed workflow.

## Files

- `wordpress-iframe-embed.html` - preferred Custom HTML block snippet with auto-height.
- `wordpress-iframe-no-script.html` - fixed-height fallback snippet.
- `wordpress-plugin/getting-started-with-passpoint-embed.php` - optional shortcode plugin.
