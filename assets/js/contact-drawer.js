(function ($) {
    "use strict";

    $(document).ready(function () {
        const $drawer = $(".contact-drawer");
        const $overlay = $(".contact-drawer-overlay");
        const $triggers = $(".contact-drawer-trigger");
        const $closeBtn = $("#closeDrawer");

        function openDrawer() {
            $drawer.addClass("active");
            $overlay.addClass("active");
            $("body").addClass("no-scroll");
        }

        function closeDrawer() {
            $drawer.removeClass("active");
            $overlay.removeClass("active");
            $("body").removeClass("no-scroll");
        }

        $triggers.on("click", function (e) {
            e.preventDefault();
            openDrawer();
        });

        $closeBtn.on("click", closeDrawer);
        $overlay.on("click", closeDrawer);

        // Close on ESC
        $(document).on("keydown", function (e) {
            if (e.key === "Escape") closeDrawer();
        });
    });

})(jQuery);
