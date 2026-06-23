<?php
/**
 * Plugin Name: Getting Started with Passpoint Embed
 * Description: Adds a shortcode for embedding the Getting Started with Passpoint guide draft.
 * Version: 1.0.0
 * Author: WBA
 */

if (!defined('ABSPATH')) {
    exit;
}

function gswp_render_getting_started_with_passpoint($atts = array()) {
    $atts = shortcode_atts(
        array(
            'src' => 'https://wifivomfranman.github.io/getting-started-with-passpoint/',
            'height' => '1200',
        ),
        $atts,
        'getting_started_with_passpoint'
    );

    $src = esc_url($atts['src']);
    $height = absint($atts['height']);
    if ($height < 400) {
        $height = 1200;
    }

    $id = 'passpoint-guide-frame-' . wp_generate_uuid4();

    ob_start();
    ?>
    <div class="passpoint-guide-embed" style="width:100%;max-width:1280px;margin:0 auto;">
        <iframe
            id="<?php echo esc_attr($id); ?>"
            title="Getting Started with Passpoint (Draft)"
            src="<?php echo $src; ?>"
            loading="lazy"
            style="width:100%;height:<?php echo esc_attr($height); ?>px;border:0;display:block;background:#f2f2f2;"
        ></iframe>
    </div>
    <script>
    (function () {
      var frame = document.getElementById(<?php echo wp_json_encode($id); ?>);
      if (!frame) return;

      window.addEventListener("message", function (event) {
        if (event.origin !== "https://wifivomfranman.github.io") return;
        if (!event.data || event.data.type !== "passpoint-guide-height") return;

        var nextHeight = parseInt(event.data.height, 10);
        if (Number.isFinite(nextHeight) && nextHeight > 400) {
          frame.style.height = Math.min(nextHeight + 24, 5000) + "px";
        }
      });
    })();
    </script>
    <?php
    return ob_get_clean();
}

add_shortcode('getting_started_with_passpoint', 'gswp_render_getting_started_with_passpoint');
